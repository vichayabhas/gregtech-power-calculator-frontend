import mongoose from "mongoose";
import React from "react";

export function calculate(
  input: unknown | number | undefined,
  plus: unknown | number | undefined,
  minus: unknown | number | undefined
) {
  return (input as number) + (plus as number) - (minus as number);
}
export const resOk = { success: true };
export const resError = { success: false };

export function getBackendUrl() {
  return process.env.NEXT_PUBLIC_BACKEND_URL;
}
export const userPath = "api/v1/auth";

export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  if (value === null || value === undefined) return false;
  return true;
}
export function sendNotification(body: string) {
  if (!("Notification" in window)) {
    throw new Error("Your browser does not support push notification");
  }
  Notification.requestPermission().then(() => {
    const notificationOptions = {
      body,
      //icon:"./image.png"
    };
    new Notification("Push Notification", notificationOptions);
  });
}

export function stringToId(input: string) {
  return new mongoose.Types.ObjectId(input);
}
export function removeElementInUseStateArray<T>(input: T[]) {
  return input.filter((e, i, a) => i < a.length - 1);
}
export function modifyElementInUseStateArray<T>(
  i: number
): (v: T, array: T[]) => T[] {
  return (v: T, array: T[]) => {
    return array.map((v2: T, i2: number) => {
      if (i == i2) {
        return v;
      } else {
        return v2;
      }
    });
  };
}
export function copyArray<T>(input: T[]): T[] {
  return input.map((e) => e);
}
export async function waiting(
  update: () => Promise<void>,
  setTimeOut: (isTimeout: boolean) => void
) {
  setTimeOut(true);
  await update();
  setTimeOut(false);
}
export function copy<T>(input: T): T {
  return input;
}
export function modifyElementInUseStateArray2Dimension<T>(
  i: number,
  j: number
): (v: T, array: T[][]) => T[][] {
  return (value: T, arrays: T[][]) =>
    modifyElementInUseStateArray<T[]>(i)(
      modifyElementInUseStateArray<T>(j)(value, arrays[i]),
      arrays
    );
}
export function setTextToInt(
  set: (input: number) => void
): React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> {
  return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const out = parseInt(event.target.value);
    if (isNaN(out)) {
      set(0);
    } else {
      set(out);
    }
  };
}
export function setTextToFloat(
  set: (input: number) => void
): React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> {
  return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const out = parseFloat(event.target.value);
    if (isNaN(out)) {
      set(0);
    } else {
      set(out);
    }
  };
}
export function setMap<T, T2>(
  set: (setter: (input: T2) => T2) => void,
  mapIn: (v: T, array: T2) => T2
): (get: T) => void {
  return (get: T) => {
    set((array) => mapIn(get, array));
  };
}
export function setTextToString(
  set: (input: string) => void,
  keepOriginal?: boolean
): React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> {
  return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (keepOriginal) {
      set(event.target.value);
    } else {
      set(event.target.value.replace(/\s/g, ""));
    }
  };
}
export function setSwop(
  input: number | null,
  set: (setter: (input: number[]) => number[]) => void
): (event: React.ChangeEvent<HTMLInputElement>) => void {
  return (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!input) {
      return;
    }
    if (event.target.checked) {
      set(addItemInUseStateArray(input));
    } else {
      set((previous: number[]) => previous.filter((e) => e != input));
    }
  };
}
export function setBoolean(
  set: (input: boolean) => void
): (event: React.ChangeEvent<HTMLInputElement>) => void {
  return (event: React.ChangeEvent<HTMLInputElement>) => {
    set(event.target.checked);
  };
}
export function cleanString(input: string) {
  return input.replace(/\s/g, "");
}
export const downloadText = "download";
export function setSwop2DimensionArray(
  id: number,
  index: number,
  set: (setter: (input: number[][]) => number[][]) => void
): (event: React.ChangeEvent<HTMLInputElement>) => void {
  return setSwop(id, (c) => {
    set((previous) =>
      modifyElementInUseStateArray<number[]>(index)(
        c(previous[index]),
        previous
      )
    );
  });
}
export function addItemInUseStateArray<T>(add: T): (previous: T[]) => T[] {
  return (previous) => [...previous, add];
}
export interface UpDownPack {
  up: boolean;
  down: boolean;
}
export interface UpMiddleDownPack {
  up: boolean;
  middle: boolean;
  down: boolean;
}
export class SetUpDownPack {
  private set: React.Dispatch<React.SetStateAction<UpDownPack>>;
  public readonly up: boolean;
  public readonly down: boolean;
  constructor(
    input: [UpDownPack, React.Dispatch<React.SetStateAction<UpDownPack>>]
  ) {
    this.set = input[1];
    this.up = input[0].up;
    this.down = input[0].down;
    this.setUp = (input) => {
      if (input) {
        this.set(({ down }) => ({ up: true, down }));
      } else {
        this.set({ up: false, down: false });
      }
    };
    this.setDown = (input) => {
      if (input) {
        this.set({ up: true, down: true });
      } else {
        this.set(({ up }) => ({ up, down: false }));
      }
    };
  }
  public readonly setUp: (event: boolean) => void;
  public readonly setDown: (event: boolean) => void;
  public static init(up: boolean, down: boolean): UpDownPack {
    return { up, down };
  }
}
export class SetUpMiddleDownPack {
  private set: React.Dispatch<React.SetStateAction<UpMiddleDownPack>>;
  public readonly up: boolean;
  public readonly middle: boolean;
  public readonly down: boolean;
  constructor(
    input: [
      UpMiddleDownPack,
      React.Dispatch<React.SetStateAction<UpMiddleDownPack>>
    ]
  ) {
    this.set = input[1];
    this.up = input[0].up;
    this.middle = input[0].middle;
    this.down = input[0].down;
    this.setUp = (input) => {
      if (input) {
        this.set(({ down, middle }) => ({ up: true, middle, down }));
      } else {
        this.set({ up: false, middle: false, down: false });
      }
    };
    this.setMiddle = (input) => {
      if (input) {
        this.set(({ down }) => ({ up: true, middle: true, down }));
      } else {
        this.set(({ up }) => ({ up, middle: false, down: false }));
      }
    };
    this.setDown = (input) => {
      if (input) {
        this.set({ up: true, middle: true, down: true });
      } else {
        this.set(({ up, middle }) => ({ up, middle, down: false }));
      }
    };
  }
  public readonly setUp: (event: boolean) => void;
  public readonly setMiddle: (event: boolean) => void;
  public readonly setDown: (event: boolean) => void;
  public static init(
    up: boolean,
    middle: boolean,
    down: boolean
  ): UpMiddleDownPack {
    return { up, middle, down };
  }
}
export function doIfTrue(input: () => void): (valid: boolean) => void {
  return (valid) => {
    if (valid) {
      input();
    }
  };
}
// export class AddRemoveHigh {
//   private addIds: number[];
//   private setAddIds: React.Dispatch<React.SetStateAction<Id[]>>;
//   private removeIds: Id[];
//   private setRemoveIds: React.Dispatch<React.SetStateAction<Id[]>>;
//   constructor(
//     addIds: Id[],
//     setAddIds: React.Dispatch<React.SetStateAction<Id[]>>,
//     removeIds: Id[],
//     setRemoveIds: React.Dispatch<React.SetStateAction<Id[]>>
//   ) {
//     this.addIds = addIds;
//     this.setAddIds = setAddIds;
//     this.removeIds = removeIds;
//     this.setRemoveIds = setRemoveIds;
//   }
//   public set(addId: Id, removeId: Id | null) {
//     return (event: React.ChangeEvent<HTMLInputElement>) => {
//       setBoolean((input) => {
//         const timeRegisterId = removeId;
//         if (!timeRegisterId) {
//           setSwop(addId, this.setAddIds)(event);
//         } else {
//           if (input) {
//             this.setRemoveIds((previous: Id[]) =>
//               previous.filter((e) => e.toString() != timeRegisterId.toString())
//             );
//           } else {
//             this.setRemoveIds(addItemInUseStateArray(timeRegisterId));
//           }
//         }
//       })(event);
//     };
//   }
//   public get(addId: Id, removeId: Id | null) {
//     return (
//       (!!removeId && !this.removeIds.includes(removeId)) ||
//       this.addIds.includes(addId)
//     );
//   }
// }

// export class SocketReady<T> {
//   private socket: Socket;
//   private eventName: SocketEvent;
//   constructor(socket: Socket, event: SocketEvent) {
//     this.socket = socket;
//     this.eventName = event;
//   }
//   public listen(room: string, event: (arg0: T) => void) {
//     this.socket.on(this.eventName, (data: T, r: string) => {
//       if (r == room) {
//         event(data);
//       }
//     });
//   }
//   public trigger(data: T, room: string) {
//     this.socket.emit(`${this.eventName}Send`, data, room);
//   }
//   public disconnect() {
//     this.socket.off(this.eventName);
//   }
// }
// export function notify(message: string) {
//   Notification.requestPermission().then((permission) => {
//     if (permission == "granted") {
//       new Notification(message);
//     }
//   });
// }
export const volts = [
  "ULV",
  "LV",
  "MV",
  "HV",
  "EV",
  "IV",
  "LuV",
  "ZPM",
  "UV",
] as const;
export type Volt = (typeof volts)[number];
export interface NameVoltPack {
  volt: Volt;
  name: string;
  powerPointIndexs: number[];
  power: number;
  source: number | null;
}
export interface PowerPoint {
  voltNameIndex: number;
  power: number;
  types: "PowerPoint" | "Transformer";
  name: string;
}
export interface Data {
  nameVoltPacks: NameVoltPack[];
  powerPoints: PowerPoint[];
  powerTable: (number | null)[][];
}
export interface Location2Dimention {
  i: number;
  j: number;
}
