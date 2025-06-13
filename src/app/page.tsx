"use client";
import FinishButton from "@/components/utility/FinishButton";
import {
  addItemInUseStateArray,
  Data,
  isFullAmp,
  Location2Dimension,
  modifyElementInUseStateArray,
  modifyElementInUseStateArray2Dimension,
  NameVoltPack,
  PowerPoint,
  setBoolean,
  setTextToInt,
  setTextToString,
  volts,
} from "@/components/utility/setup";
import { Checkbox, MenuItem, Select, TextField } from "@mui/material";
import React from "react";

function readPower(data: Data, sourceIndex: number, isOnlyPowerPoint: boolean) {
  let output = 0;
  const nameVoltPack = data.nameVoltPacks[sourceIndex];
  let i = 0;
  while (i < nameVoltPack.powerPointIndexes.length) {
    const powerPoint = data.powerPoints[nameVoltPack.powerPointIndexes[i++]];
    switch (powerPoint.types) {
      case "PowerPoint": {
        output = output + powerPoint.power;
        break;
      }
      case "Transformer": {
        if (isOnlyPowerPoint) {
          break;
        }
        output = output + readPower(data, powerPoint.power, isOnlyPowerPoint);
        break;
      }
    }
  }
  return output;
}
export default function Home() {
  const [data, setData] = React.useState<Data>({
    nameVoltPacks: [],
    powerPoints: [],
    powerTable: [[null]],
    note: "",
  });
  const [voltIndex, setVoltIndex] = React.useState(1);
  const [name, setName] = React.useState("");
  const [location, setLocation] = React.useState<Location2Dimension>({
    i: 0,
    j: 0,
  });
  const [voltNameIndex, setVoltNameIndex] = React.useState(0);
  const [power, setPower] = React.useState(0);
  const [types, setTypes] = React.useState<"PowerPoint" | "Transformer">(
    "PowerPoint"
  );
  const [editIndex, setEditIndex] = React.useState(0);
  const [fullTemporaryPower, setFullTemporaryPower] = React.useState(0);
  let temporaryPower = 0;
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Select
        value={voltIndex}
        variant="standard"
        name="location"
        id="location"
        className="h-[2em] w-[200px] text-black"
        sx={{
          color: "black",
        }}
        renderValue={() => volts[voltIndex]}
      >
        {volts.map((v, i) => (
          <MenuItem onClick={() => setVoltIndex(i)} key={i}>
            {v}
          </MenuItem>
        ))}
      </Select>
      name
      <TextField onChange={setTextToString(setName)} value={name} />
      <FinishButton
        text="add volt"
        onClick={() => {
          setData(({ powerPoints, powerTable, nameVoltPacks, note }) => ({
            powerPoints,
            powerTable,
            nameVoltPacks: addItemInUseStateArray<NameVoltPack>({
              voltIndex,
              name,
              powerPointIndexes: [],
              source: null,
              check: false,
            })(nameVoltPacks),
            note,
          }));
        }}
      />
      <table>
        <tr>
          <th>name</th>
          <th>volt</th>
          <th>power</th>
          <th>used</th>
          <th>transformValid</th>
          <th>power only at this volt</th>
          <th>check</th>
        </tr>
        {data.nameVoltPacks.map((nameVoltPack, i) => {
          return (
            <tr key={i}>
              <td onClick={() => setEditIndex(i)}>
                {i == editIndex ? (
                  <TextField
                    value={nameVoltPack.name}
                    onChange={setTextToString((typing) => {
                      setData(
                        ({ powerPoints, powerTable, nameVoltPacks, note }) => ({
                          powerPoints,
                          powerTable,
                          nameVoltPacks:
                            modifyElementInUseStateArray<NameVoltPack>(i)(
                              {
                                name: typing,
                                voltIndex: nameVoltPack.voltIndex,
                                powerPointIndexes:
                                  nameVoltPack.powerPointIndexes,
                                source: nameVoltPack.source,
                                check: nameVoltPack.check,
                              },
                              nameVoltPacks
                            ),
                          note,
                        })
                      );
                    })}
                  />
                ) : (
                  nameVoltPack.name
                )}
              </td>
              <td>{volts[nameVoltPack.voltIndex]}</td>
              <td>{readPower(data, i, false)}</td>
              <td>{nameVoltPack.powerPointIndexes.length}</td>
              <td>
                <Checkbox
                  readOnly
                  checked={isFullAmp(
                    true,
                    readPower(data, i, false),
                    nameVoltPack.voltIndex
                  )}
                />
              </td>
              <td>{readPower(data, i, true)}</td>
              <td>
                <Checkbox
                  checked={data.nameVoltPacks[i].check}
                  onChange={setBoolean((check) => {
                    setData(
                      ({ nameVoltPacks, powerPoints, powerTable, note }) => {
                        return {
                          powerPoints,
                          powerTable,
                          nameVoltPacks:
                            modifyElementInUseStateArray<NameVoltPack>(i)(
                              {
                                name: nameVoltPacks[i].name,
                                voltIndex: nameVoltPacks[i].voltIndex,
                                powerPointIndexes:
                                  nameVoltPacks[i].powerPointIndexes,
                                source: nameVoltPacks[i].source,
                                check,
                              },
                              nameVoltPacks
                            ),
                          note,
                        };
                      }
                    );
                  })}
                />
              </td>
            </tr>
          );
        })}
      </table>
      <FinishButton
        text="add column"
        onClick={() => {
          setData(({ powerPoints, powerTable, nameVoltPacks, note }) => ({
            powerPoints,
            nameVoltPacks,
            powerTable: powerTable.map(
              addItemInUseStateArray<number | null>(null)
            ),
            note,
          }));
        }}
      />
      <FinishButton
        text="add row"
        onClick={() => {
          setData(({ powerPoints, powerTable, nameVoltPacks, note }) => ({
            powerPoints,
            nameVoltPacks,
            powerTable: addItemInUseStateArray<(number | null)[]>(
              powerTable[0].map(() => null)
            )(powerTable),
            note,
          }));
        }}
      />
      <table>
        {data.powerTable.map((powerTableRow, i) => {
          return (
            <tr key={i}>
              {powerTableRow.map((powerTableElement, j) => {
                if (
                  powerTableElement != null &&
                  data.powerPoints[powerTableElement].isIncludeTemporary
                ) {
                  temporaryPower =
                    temporaryPower + data.powerPoints[powerTableElement].power;
                }
                return (
                  <td key={j}>
                    {powerTableElement != null
                      ? `${data.powerPoints[powerTableElement].types} ${
                          data.powerPoints[powerTableElement].name
                        } ${
                          volts[
                            data.nameVoltPacks[
                              data.powerPoints[powerTableElement].voltNameIndex
                            ].voltIndex
                          ]
                        } ${
                          data.powerPoints[powerTableElement].types ==
                          "PowerPoint"
                            ? data.powerPoints[powerTableElement].power
                            : volts[
                                data.nameVoltPacks[
                                  data.powerPoints[powerTableElement].power
                                ].voltIndex
                              ]
                        }${
                          data.powerPoints[powerTableElement].types ==
                          "Transformer"
                            ? ""
                            : isFullAmp(
                                false,
                                data.powerPoints[powerTableElement].power,
                                data.nameVoltPacks[
                                  data.powerPoints[powerTableElement]
                                    .voltNameIndex
                                ].voltIndex
                              )
                            ? " valid"
                            : " invalid"
                        }`
                      : null}
                    {location.i == i &&
                    location.j == j &&
                    powerTableElement != null &&
                    data.powerPoints[powerTableElement].types !=
                      "Transformer" ? (
                      <TextField
                        value={data.powerPoints[
                          powerTableElement
                        ].power.toString()}
                        onChange={setTextToInt((typing) => {
                          setData((previousData) => {
                            const newPowerPoints =
                              modifyElementInUseStateArray<PowerPoint>(
                                powerTableElement
                              )(
                                {
                                  power: typing,
                                  name: previousData.powerPoints[
                                    powerTableElement
                                  ].name,
                                  voltNameIndex:
                                    previousData.powerPoints[powerTableElement]
                                      .voltNameIndex,
                                  types: "PowerPoint",
                                  isIncludeTemporary:
                                    previousData.powerPoints[powerTableElement]
                                      .isIncludeTemporary,
                                },
                                previousData.powerPoints
                              );
                            return {
                              powerPoints: newPowerPoints,
                              powerTable: previousData.powerTable,
                              nameVoltPacks: previousData.nameVoltPacks,
                              note: previousData.note,
                            };
                          });
                        })}
                        type="number"
                      />
                    ) : null}
                    {powerTableElement != null &&
                    data.powerPoints[powerTableElement].types !=
                      "Transformer" ? (
                      <Checkbox
                        checked={
                          data.powerPoints[powerTableElement].isIncludeTemporary
                        }
                        onChange={setBoolean((check) => {
                          setData((previousData) => {
                            const newPowerPoints =
                              modifyElementInUseStateArray<PowerPoint>(
                                powerTableElement
                              )(
                                {
                                  power:
                                    previousData.powerPoints[powerTableElement]
                                      .power,
                                  name: previousData.powerPoints[
                                    powerTableElement
                                  ].name,
                                  voltNameIndex:
                                    previousData.powerPoints[powerTableElement]
                                      .voltNameIndex,
                                  types: "PowerPoint",
                                  isIncludeTemporary: check,
                                },
                                previousData.powerPoints
                              );
                            return {
                              powerPoints: newPowerPoints,
                              powerTable: previousData.powerTable,
                              nameVoltPacks: previousData.nameVoltPacks,
                              note: previousData.note,
                            };
                          });
                        })}
                      />
                    ) : null}
                    {location.i != i || location.j != j ? (
                      <FinishButton
                        text="edit"
                        onClick={() => {
                          setLocation({ i, j });
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
                                return `${data.nameVoltPacks[v].name} ${
                                  volts[data.nameVoltPacks[v].voltIndex]
                                }`;
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
                                    {nameVoltPack.name}{" "}
                                    {volts[nameVoltPack.voltIndex]}
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
                                    return `${data.nameVoltPacks[v].name} ${
                                      volts[data.nameVoltPacks[v].voltIndex]
                                    }`;
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
                                        {nameVoltPack.name}{" "}
                                        {volts[nameVoltPack.voltIndex]}
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
                                    note,
                                  }) => {
                                    const newPowerTable =
                                      modifyElementInUseStateArray2Dimension<
                                        number | null
                                      >(i, j)(powerPoints.length, powerTable);
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
                                              voltIndex: n.voltIndex,
                                              powerPointIndexes:
                                                n.powerPointIndexes,
                                              name: n.name,
                                              check: n.check,
                                            };
                                          } else if (i2 == voltNameIndex) {
                                            return {
                                              source: n.source,
                                              voltIndex: n.voltIndex,
                                              powerPointIndexes: [
                                                ...n.powerPointIndexes,
                                                powerPoints.length,
                                              ],
                                              name: n.name,
                                              check: n.check,
                                            };
                                          } else {
                                            return n;
                                          }
                                        }
                                      );
                                    const newPowerPoints =
                                      addItemInUseStateArray<PowerPoint>({
                                        power,
                                        types,
                                        name,
                                        voltNameIndex,
                                        isIncludeTemporary: false,
                                      })(powerPoints);
                                    return {
                                      nameVoltPacks: newNameVoltPacks,
                                      powerPoints: newPowerPoints,
                                      powerTable: newPowerTable,
                                      note,
                                    };
                                  }
                                );
                              }}
                            />
                          </>
                        ) : powerTableElement != null ? (
                          <TextField
                            value={data.powerPoints[powerTableElement].name}
                            onChange={setTextToString((typing) => {
                              setData((previousData) => {
                                const newPowerPoints =
                                  modifyElementInUseStateArray<PowerPoint>(
                                    powerTableElement
                                  )(
                                    {
                                      power:
                                        previousData.powerPoints[
                                          powerTableElement
                                        ].power,
                                      name: typing,
                                      voltNameIndex:
                                        previousData.powerPoints[
                                          powerTableElement
                                        ].voltNameIndex,
                                      types: "PowerPoint",
                                      isIncludeTemporary:
                                        previousData.powerPoints[
                                          powerTableElement
                                        ].isIncludeTemporary,
                                    },
                                    previousData.powerPoints
                                  );
                                return {
                                  powerPoints: newPowerPoints,
                                  powerTable: previousData.powerTable,
                                  nameVoltPacks: previousData.nameVoltPacks,
                                  note: previousData.note,
                                };
                              });
                            })}
                          />
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
      <div>temporary power={temporaryPower}</div>
      <div>
        <label>full temporary power</label>
        <TextField
          value={fullTemporaryPower.toString()}
          onChange={setTextToInt(setFullTemporaryPower)}
        />
      </div>
      <div>remain temporary power={fullTemporaryPower - temporaryPower}</div>
      <div>
        <label>note</label>
        <TextField
          value={data.note}
          onChange={setTextToString((note) => {
            setData(({ powerPoints, powerTable, nameVoltPacks }) => ({
              nameVoltPacks,
              note,
              powerPoints,
              powerTable,
            }));
          }, true)}
        />
      </div>
      <TextField
        value={JSON.stringify(data)}
        onChange={setTextToString((input) => {
          setData(JSON.parse(input));
        }, true)}
      />
    </main>
  );
}
