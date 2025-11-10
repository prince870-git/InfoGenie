import sql from "@/app/api/utils/sql";

// Create search history entry
export async function POST(request) {
  try {
    const { query, search_mode, summary, sources, citations, user_id } =
      await request.json();

    if (!query || !query.trim()) {
      return Response.json({ error: "Query is required" }, { status: 400 });
    }

    // Check if database is available
    if (!process.env.DATABASE_URL) {
      // Return success without saving if DB not configured
      return Response.json({
        id: Date.now().toString(),
        query: query.trim(),
        search_mode: search_mode || "general",
        summary: summary || "",
        sources: sources || [],
        citations: citations || [],
        user_id: user_id || "anonymous",
        created_at: new Date().toISOString(),
        message: "Database not configured - history not persisted"
      });
    }

    const [result] = await sql`
      INSERT INTO search_history (query, search_mode, summary, sources, citations, user_id)
      VALUES (${query.trim()}, ${search_mode || "general"}, ${summary || ""}, ${JSON.stringify(sources || [])}, ${JSON.stringify(citations || [])}, ${user_id || "anonymous"})
      RETURNING *
    `;

    return Response.json(result);
  } catch (error) {
    console.error("Error creating search history:", error);
    // Don't fail the request if history save fails
    return Response.json({
      id: Date.now().toString(),
      query: query?.trim() || "",
      message: "Search completed but history not saved"
    });
  }
}

// Get search history
export async function GET(request) {
  try {
    // Check if database is available
    if (!process.env.DATABASE_URL) {
      return Response.json([]); // Return empty array if DB not configured
    }

    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id") || "anonymous";
    const search_mode = searchParams.get("mode");
    const limit = parseInt(searchParams.get("limit")) || 20;
    const offset = parseInt(searchParams.get("offset")) || 0;

    let baseQuery = `
      SELECT id, query, search_mode, summary, sources, citations, created_at, updated_at
      FROM search_history 
      WHERE user_id = $1
    `;
    const values = [user_id];

    if (search_mode) {
      baseQuery += ` AND search_mode = $${values.length + 1}`;
      values.push(search_mode);
    }

    baseQuery += ` ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);

    const results = await sql(baseQuery, values);

    // Parse JSON fields
    const formattedResults = results.map((result) => ({
      ...result,
      sources:
        typeof result.sources === "string"
          ? JSON.parse(result.sources)
          : result.sources,
      citations:
        typeof result.citations === "string"
          ? JSON.parse(result.citations)
          : result.citations,
    }));

    return Response.json(formattedResults);
  } catch (error) {
    console.error("Error fetching search history:", error);
    return Response.json([]); // Return empty array on error
  }
}

// Update search history item
export async function PUT(request) {
  try {
    const { id, query, search_mode, summary, sources, citations } =
      await request.json();

    if (!id) {
      return Response.json({ error: "Search ID is required" }, { status: 400 });
    }

    const updateFields = [];
    const values = [];

    if (query !== undefined && query.trim()) {
      updateFields.push("query = $" + (values.length + 1));
      values.push(query.trim());
    }

    if (search_mode !== undefined) {
      updateFields.push("search_mode = $" + (values.length + 1));
      values.push(search_mode);
    }

    if (summary !== undefined) {
      updateFields.push("summary = $" + (values.length + 1));
      values.push(summary);
    }

    if (sources !== undefined) {
      updateFields.push("sources = $" + (values.length + 1));
      values.push(JSON.stringify(sources));
    }

    if (citations !== undefined) {
      updateFields.push("citations = $" + (values.length + 1));
      values.push(JSON.stringify(citations));
    }

    updateFields.push("updated_at = CURRENT_TIMESTAMP");

    if (updateFields.length === 1) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    values.push(id);
    const whereClause = "$" + values.length;

    const queryString = `
      UPDATE search_history 
      SET ${updateFields.join(", ")}
      WHERE id = ${whereClause}
      RETURNING *
    `;

    const [result] = await sql(queryString, values);

    if (!result) {
      return Response.json(
        { error: "Search history item not found" },
        { status: 404 },
      );
    }

    const formattedResult = {
      ...result,
      sources:
        typeof result.sources === "string"
          ? JSON.parse(result.sources)
          : result.sources,
      citations:
        typeof result.citations === "string"
          ? JSON.parse(result.citations)
          : result.citations,
    };

    return Response.json(formattedResult);
  } catch (error) {
    console.error("Error updating search history:", error);
    return Response.json(
      { error: "Failed to update search history" },
      { status: 500 },
    );
  }
}

// Delete search history item
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Search ID is required" }, { status: 400 });
    }

    const [result] = await sql`
      DELETE FROM search_history 
      WHERE id = ${id}
      RETURNING *
    `;

    if (!result) {
      return Response.json(
        { error: "Search history item not found" },
        { status: 404 },
      );
    }

    return Response.json({
      message: "Search history item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting search history:", error);
    return Response.json(
      { error: "Failed to delete search history" },
      { status: 500 },
    );
  }
}
