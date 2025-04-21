"use client";
import FinishButton from "@/components/utility/FinishButton";
import {
  Data,
  Location2Dimention,
  NameVoltPack,
  PowerPoint,
  setTextToInt,
  setTextToString,
  Volt,
  volts,
} from "@/components/utility/setup";
import { MenuItem, Select, TextField } from "@mui/material";
import React from "react";

function editPower(
  { powerPoints, powerTable, nameVoltPacks }: Data,
  powerPointIndex: number,
  add: number
): Data {
  const nameVoltPack =
    nameVoltPacks[powerPoints[powerPointIndex].voltNameIndex];
  if (nameVoltPack.source == null) {
    return {
      powerTable,
      powerPoints,
      nameVoltPacks: nameVoltPacks.map<NameVoltPack>((n, i) => {
        if (i == powerPoints[powerPointIndex].voltNameIndex) {
          return {
            name: n.name,
            volt: n.volt,
            power: n.power + add,
            powerPointIndexs: n.powerPointIndexs,
            source: n.source,
          };
        } else {
          return n;
        }
      }),
    };
  } else {
    return editPower(
      {
        powerTable,
        powerPoints,
        nameVoltPacks: nameVoltPacks.map<NameVoltPack>((n, i) => {
          if (i == powerPoints[powerPointIndex].voltNameIndex) {
            return {
              name: n.name,
              volt: n.volt,
              power: n.power + add,
              powerPointIndexs: n.powerPointIndexs,
              source: n.source,
            };
          } else {
            return n;
          }
        }),
      },
      nameVoltPack.source,
      add
    );
  }
}
export default function Home() {
  const [data, setData] = React.useState<Data>({
    nameVoltPacks: [],
    powerPoints: [],
    powerTable: [[null]],
  });
  const [volt, setVolt] = React.useState<Volt>("LV");
  const [name, setName] = React.useState("");
  const [location, setLocation] = React.useState<Location2Dimention>({
    i: 0,
    j: 0,
  });
  const [voltNameIndex, setVoltNameIndex] = React.useState(0);
  const [power, setPower] = React.useState(0);
  const [types, setTypes] = React.useState<"PowerPoint" | "Transformer">(
    "PowerPoint"
  );
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Select
        value={volt}
        variant="standard"
        name="location"
        id="location"
        className="h-[2em] w-[200px] text-black"
        sx={{
          color: "black",
        }}
        renderValue={() => volt}
      >
        {volts.map((v, i) => (
          <MenuItem onClick={() => setVolt(v)} key={i}>
            {v}
          </MenuItem>
        ))}
      </Select>
      name
      <TextField onChange={setTextToString(setName)} value={name} />
      <FinishButton
        text="add volt"
        onClick={() => {
          setData(({ powerPoints, powerTable, nameVoltPacks }) => ({
            powerPoints,
            powerTable,
            nameVoltPacks: [
              ...nameVoltPacks,
              { volt, name, power: 0, powerPointIndexs: [], source: null },
            ],
          }));
        }}
      />
      <table>
        <tr>
          <th>name</th>
          <th>volt</th>
          <th>power</th>
          <th>used</th>
        </tr>
        {data.nameVoltPacks.map((nameVoltPack, i) => {
          return (
            <tr key={i}>
              <td>{nameVoltPack.name}</td>
              <td>{nameVoltPack.volt}</td>
              <td>{nameVoltPack.power}</td>
              <td>{nameVoltPack.powerPointIndexs.length}</td>
            </tr>
          );
        })}
      </table>
      <FinishButton
        text="add calum"
        onClick={() => {
          setData(({ powerPoints, powerTable, nameVoltPacks }) => ({
            powerPoints,
            nameVoltPacks,
            powerTable: powerTable.map((v) => [...v, null]),
          }));
        }}
      />
      <FinishButton
        text="add row"
        onClick={() => {
          setData(({ powerPoints, powerTable, nameVoltPacks }) => ({
            powerPoints,
            nameVoltPacks,
            powerTable: [...powerTable, powerTable[0].map(() => null)],
          }));
        }}
      />
      <table>
        {data.powerTable.map((powerTableRow, i) => {
          return (
            <tr key={i}>
              {powerTableRow.map((powerTableElement, j) => {
                return (
                  <td key={j}>
                    {powerTableElement != null
                      ? `${data.powerPoints[powerTableElement].types} ${
                          data.powerPoints[powerTableElement].name
                        } ${
                          data.nameVoltPacks[
                            data.powerPoints[powerTableElement].voltNameIndex
                          ].volt
                        } ${
                          data.powerPoints[powerTableElement].types ==
                          "PowerPoint"
                            ? data.powerPoints[powerTableElement].power
                            : data.nameVoltPacks[
                                data.powerPoints[powerTableElement].power
                              ].volt
                        }`
                      : null}
                    {location.i == i &&
                    location.j == j &&
                    powerTableElement != null &&
                    data.powerPoints[powerTableElement].types !=
                      "Transformer" ? (
                      <TextField
                        value={power.toString()}
                        onChange={setTextToInt((typeping) => {
                          setPower((previous) => {
                            const add = typeping - previous;

                            setData((previousData) => {
                              const newPowerPoints =
                                previousData.powerPoints.map<PowerPoint>(
                                  (powerPoint, l) => {
                                    if (l == powerTableElement) {
                                      return {
                                        power: powerPoint.power + add,
                                        name: powerPoint.name,
                                        voltNameIndex: powerPoint.voltNameIndex,
                                        types: "PowerPoint",
                                      };
                                    } else {
                                      return powerPoint;
                                    }
                                  }
                                );
                              const source =
                                previousData.nameVoltPacks[
                                  newPowerPoints[powerTableElement]
                                    .voltNameIndex
                                ].source;
                              if (source == null) {
                                return {
                                  powerPoints: newPowerPoints,
                                  powerTable: previousData.powerTable,
                                  nameVoltPacks: previousData.nameVoltPacks,
                                };
                              } else {
                                return editPower(
                                  {
                                    powerPoints: newPowerPoints,
                                    powerTable: previousData.powerTable,
                                    nameVoltPacks: previousData.nameVoltPacks,
                                  },
                                  source,
                                  add
                                );
                              }
                            });
                            return typeping;
                          });
                        })}
                      />
                    ) : null}
                    {location.i != i || location.j != j ? (
                      <FinishButton
                        text="edit"
                        onClick={() => {
                          setLocation({ i, j });
                          if (
                            powerTableElement != null &&
                            data.powerPoints[powerTableElement].types !=
                              "Transformer"
                          ) {
                            setPower(data.powerPoints[powerTableElement].power);
                          }
                        }}
                      />
                    ) : (
                      <div>
                        {data.nameVoltPacks.length > 0 &&
                        powerTableElement == null ? (
                          <>
                            <Select
                              value={voltNameIndex}
                              renderValue={(v) => {
                                return `${data.nameVoltPacks[v].name} ${data.nameVoltPacks[v].volt}`;
                              }}
                            >
                              {data.nameVoltPacks.map((nameVoltPack, l) => {
                                return (
                                  <MenuItem
                                    key={l}
                                    onClick={() => {
                                      setVoltNameIndex(l);
                                    }}
                                  >
                                    {nameVoltPack.name} {nameVoltPack.volt}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                            name
                            <TextField
                              onChange={setTextToString(setName)}
                              value={name}
                            />
                            {types == "PowerPoint" ? (
                              <>
                                power
                                <TextField
                                  onChange={setTextToInt(setPower)}
                                  value={power.toString()}
                                  type="number"
                                />
                                <FinishButton
                                  text="transformer"
                                  onClick={() => {
                                    setPower(0);
                                    setTypes("Transformer");
                                  }}
                                />
                              </>
                            ) : (
                              <>
                                to
                                <Select
                                  value={power}
                                  renderValue={(v) => {
                                    return `${data.nameVoltPacks[v].name} ${data.nameVoltPacks[v].volt}`;
                                  }}
                                >
                                  {data.nameVoltPacks.map((nameVoltPack, l) => {
                                    return (
                                      <MenuItem
                                        key={l}
                                        onClick={() => {
                                          setPower(l);
                                        }}
                                      >
                                        {nameVoltPack.name} {nameVoltPack.volt}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                                <FinishButton
                                  text="power point"
                                  onClick={() => {
                                    setTypes("PowerPoint");
                                  }}
                                />
                              </>
                            )}
                            <FinishButton
                              text="add"
                              onClick={() => {
                                setData(
                                  ({
                                    powerPoints,
                                    powerTable,
                                    nameVoltPacks,
                                  }) => {
                                    const newPowerTable = powerTable.map(
                                      (powerTableRow, i2) => {
                                        if (i == i2) {
                                          return powerTableRow.map((v, j2) => {
                                            if (j == j2) {
                                              return powerPoints.length;
                                            } else {
                                              return v;
                                            }
                                          });
                                        } else {
                                          return powerTableRow;
                                        }
                                      }
                                    );
                                    const realPower =
                                      types == "PowerPoint"
                                        ? power
                                        : nameVoltPacks[power].power;
                                    const newNameVoltPacks =
                                      nameVoltPacks.map<NameVoltPack>(
                                        (n, i2) => {
                                          if (
                                            i2 == power &&
                                            n.source == null &&
                                            types == "Transformer"
                                          ) {
                                            return {
                                              source: powerPoints.length,
                                              volt: n.volt,
                                              powerPointIndexs:
                                                n.powerPointIndexs,
                                              name: n.name,
                                              power: n.power,
                                            };
                                          } else if (i2 == voltNameIndex) {
                                            return {
                                              source: n.source,
                                              volt: n.volt,
                                              powerPointIndexs:
                                                n.powerPointIndexs,
                                              name: n.name,
                                              power: n.power + realPower,
                                            };
                                          } else {
                                            return n;
                                          }
                                        }
                                      );
                                    const newPowerPoints: PowerPoint[] = [
                                      ...powerPoints,
                                      { power, types, name, voltNameIndex },
                                    ];
                                    const source =
                                      newNameVoltPacks[voltNameIndex].source;
                                    if (source == null) {
                                      return {
                                        nameVoltPacks: newNameVoltPacks,
                                        powerPoints: newPowerPoints,
                                        powerTable: newPowerTable,
                                      };
                                    } else {
                                      return editPower(
                                        {
                                          nameVoltPacks: newNameVoltPacks,
                                          powerPoints: newPowerPoints,
                                          powerTable: newPowerTable,
                                        },
                                        source,
                                        realPower
                                      );
                                    }
                                  }
                                );
                              }}
                            />
                          </>
                        ) : null}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </table>
      <TextField
        value={JSON.stringify(data)}
        onChange={setTextToString((input) => {
          setData(JSON.parse(input));
        }, true)}
      />
    </main>
  );
}
