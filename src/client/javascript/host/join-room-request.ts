export async function fetchRoomIdFromCode(roomCode: string): Promise<string | null> {
  try {
    const res = await fetch(`${__SERVER_URL__}/api/room/${roomCode}`);
    if (!res.ok) return null;
    const data = await res.json() as { roomId?: string } | null;
    return data?.roomId ?? null;
  } catch {
    return null;
  }
}
