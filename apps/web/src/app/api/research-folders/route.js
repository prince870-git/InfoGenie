import sql from '@/app/api/utils/sql';

// Create new research folder
export async function POST(request) {
  try {
    const { folder_name, user_id } = await request.json();

    if (!folder_name || !folder_name.trim()) {
      return Response.json({ error: 'Folder name is required' }, { status: 400 });
    }

    const [result] = await sql`
      INSERT INTO research_folders (folder_name, user_id)
      VALUES (${folder_name.trim()}, ${user_id || 'anonymous'})
      RETURNING *
    `;

    return Response.json(result);
  } catch (error) {
    console.error('Error creating research folder:', error);
    if (error.message.includes('duplicate key')) {
      return Response.json({ error: 'Folder with this name already exists' }, { status: 409 });
    }
    return Response.json({ error: 'Failed to create research folder' }, { status: 500 });
  }
}

// Get user's research folders
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id') || 'anonymous';

    const results = await sql`
      SELECT * FROM research_folders 
      WHERE user_id = ${user_id}
      ORDER BY folder_name ASC
    `;

    return Response.json(results);
  } catch (error) {
    console.error('Error fetching research folders:', error);
    return Response.json({ error: 'Failed to fetch research folders' }, { status: 500 });
  }
}