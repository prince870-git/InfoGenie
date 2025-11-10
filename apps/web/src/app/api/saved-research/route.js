import sql from '@/app/api/utils/sql';

// Save research item
export async function POST(request) {
  try {
    const { search_id, title, folder, notes, user_id } = await request.json();

    if (!search_id || !title || !title.trim()) {
      return Response.json({ error: 'Search ID and title are required' }, { status: 400 });
    }

    const [result] = await sql`
      INSERT INTO saved_research (search_id, title, folder, notes, user_id)
      VALUES (${search_id}, ${title.trim()}, ${folder || 'General'}, ${notes || ''}, ${user_id || 'anonymous'})
      RETURNING *
    `;

    return Response.json(result);
  } catch (error) {
    console.error('Error saving research:', error);
    return Response.json({ error: 'Failed to save research' }, { status: 500 });
  }
}

// Get saved research items
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id') || 'anonymous';
    const folder = searchParams.get('folder');
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = parseInt(searchParams.get('offset')) || 0;

    let query = sql`
      SELECT 
        sr.id,
        sr.title,
        sr.folder,
        sr.notes,
        sr.created_at as saved_at,
        sh.query,
        sh.search_mode,
        sh.summary,
        sh.sources,
        sh.citations,
        sh.created_at as searched_at
      FROM saved_research sr
      JOIN search_history sh ON sr.search_id = sh.id
      WHERE sr.user_id = ${user_id}
    `;

    if (folder) {
      query = sql`
        SELECT 
          sr.id,
          sr.title,
          sr.folder,
          sr.notes,
          sr.created_at as saved_at,
          sh.query,
          sh.search_mode,
          sh.summary,
          sh.sources,
          sh.citations,
          sh.created_at as searched_at
        FROM saved_research sr
        JOIN search_history sh ON sr.search_id = sh.id
        WHERE sr.user_id = ${user_id} AND sr.folder = ${folder}
      `;
    }

    const results = await sql`
      ${query}
      ORDER BY sr.created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    return Response.json(results);
  } catch (error) {
    console.error('Error fetching saved research:', error);
    return Response.json({ error: 'Failed to fetch saved research' }, { status: 500 });
  }
}

// Update saved research item
export async function PUT(request) {
  try {
    const { id, title, folder, notes } = await request.json();

    if (!id) {
      return Response.json({ error: 'Research ID is required' }, { status: 400 });
    }

    const updateFields = [];
    const values = [];

    if (title !== undefined && title.trim()) {
      updateFields.push('title = $' + (values.length + 1));
      values.push(title.trim());
    }

    if (folder !== undefined) {
      updateFields.push('folder = $' + (values.length + 1));
      values.push(folder);
    }

    if (notes !== undefined) {
      updateFields.push('notes = $' + (values.length + 1));
      values.push(notes);
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');

    if (updateFields.length === 1) { // Only timestamp update
      return Response.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(id); // Add ID at the end
    const whereClause = '$' + values.length;

    const queryString = `
      UPDATE saved_research 
      SET ${updateFields.join(', ')}
      WHERE id = ${whereClause}
      RETURNING *
    `;

    const [result] = await sql(queryString, values);

    if (!result) {
      return Response.json({ error: 'Research item not found' }, { status: 404 });
    }

    return Response.json(result);
  } catch (error) {
    console.error('Error updating saved research:', error);
    return Response.json({ error: 'Failed to update research' }, { status: 500 });
  }
}

// Delete saved research item
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'Research ID is required' }, { status: 400 });
    }

    const [result] = await sql`
      DELETE FROM saved_research 
      WHERE id = ${id}
      RETURNING *
    `;

    if (!result) {
      return Response.json({ error: 'Research item not found' }, { status: 404 });
    }

    return Response.json({ message: 'Research item deleted successfully' });
  } catch (error) {
    console.error('Error deleting saved research:', error);
    return Response.json({ error: 'Failed to delete research' }, { status: 500 });
  }
}