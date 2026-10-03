import { games } from "../../../data/games";

export const dynamic = "force-dynamic";

export async function GET() {
  const ids = games.map(g => g.robloxId).filter(Boolean) as string[];
  if (!ids.length) return Response.json({ totalPlayers: 0, totalVisits: 0, games: [] });

  try {
    const url = "https://games.roblox.com/v1/games?universeIds=" + ids.join(",");
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) return Response.json({ error: "Roblox stats unavailable" }, { status: 502 });
    const json = await r.json();
    const byId = new Map((json.data || []).map((x: any) => [String(x.id), x]));
    const rows = ids.map(id => {
      const x = byId.get(id);
      return {
        robloxId: id,
        title: games.find(g => g.robloxId === id)?.title || x?.name || "Unknown",
        players: Number(x?.playing || 0),
        visits: Number(x?.visits || 0),
        favorites: Number(x?.favoritedCount || 0),
      };
    });
    return Response.json({
      totalPlayers: rows.reduce((n, x) => n + x.players, 0),
      totalVisits: rows.reduce((n, x) => n + x.visits, 0),
      totalFavorites: rows.reduce((n, x) => n + x.favorites, 0),
      games: rows,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return Response.json({ error: "Roblox stats unavailable" }, { status: 502 });
  }
}
