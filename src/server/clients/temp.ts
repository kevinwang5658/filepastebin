//TODO: Switch from a map to redis in the future
import { RoomState } from '../signaling/room-state';

// TODO: replace with AWS key value store
export const RoomsMap = new Map<string, RoomState>();
export const RoomCodeToRoomIdMap = new Map<string, string>()