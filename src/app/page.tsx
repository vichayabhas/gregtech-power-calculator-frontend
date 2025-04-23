"use client";
import FinishButton from "@/components/utility/FinishButton";
import {
  addItemInUseStateArray,
  Data,
  isFullAmp,
  Location2Dimention,
  modifyElementInUseStateArray,
  modifyElementInUseStateArray2Dimension,
  NameVoltPack,
  PowerPoint,
  setTextToInt,
  setTextToString,
  volts,
} from "@/components/utility/setup";
import { Checkbox, MenuItem, Select, TextField } from "@mui/material";
import React from "react";

function readPower(data: Data, sourceIndex: number) {
  let output = 0;
  const nameVoltPack = data.nameVoltPacks[sourceIndex];
  let i = 0;
  while (i < nameVoltPack.powerPointIndexs.length) {
    const powerPoint = data.powerPoints[nameVoltPack.powerPointIndexs[i++]];
    switch (powerPoint.types) {
      case "PowerPoint": {
        output = output + powerPoint.power;
        break;
      }
      case "Transformer": {
        output = output + readPower(data, powerPoint.power);
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
  });
  const [voltIndex, setVoltIndex] = React.useState(1);
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
  const [editIndex, setEditIndex] = React.useState(0);
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
          setData(({ powerPoints, powerTable, nameVoltPacks }) => ({
            powerPoints,
            powerTable,
            nameVoltPacks: addItemInUseStateArray<NameVoltPack>({
              voltIndex,
              name,
              powerPointIndexs: [],
              source: null,
            })(nameVoltPacks),
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
        </tr>
        {data.nameVoltPacks.map((nameVoltPack, i) => {
          return (
            <tr key={i}>
              <td onClick={() => setEditIndex(i)}>
                {i == editIndex ? (
                  <TextField
                    value={nameVoltPack.name}
                    onChange={setTextToString((typing) => {
                      setData(({ powerPoints, powerTable, nameVoltPacks }) => ({
                        powerPoints,
                        powerTable,
                        nameVoltPacks:
                          modifyElementInUseStateArray<NameVoltPack>(i)(
                            {
                              name: typing,
                              voltIndex: nameVoltPack.voltIndex,
                              powerPointIndexs: nameVoltPack.powerPointIndexs,
                              source: nameVoltPack.source,
                            },
                            nameVoltPacks
                          ),
                      }));
                    })}
                  />
                ) : (
                  nameVoltPack.name
                )}
              </td>
              <td>{volts[nameVoltPack.voltIndex]}</td>
              <td>{readPower(data, i)}</td>
              <td>{nameVoltPack.powerPointIndexs.length}</td>
              <td>
                <Checkbox
                  readOnly
                  checked={isFullAmp(
                    true,
                    readPower(data, i),
                    nameVoltPack.voltIndex
                  )}
                />
              </td>
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
            powerTable: powerTable.map(
              addItemInUseStateArray<number | null>(null)
            ),
          }));
        }}
      />
      <FinishButton
        text="add row"
        onClick={() => {
          setData(({ powerPoints, powerTable, nameVoltPacks }) => ({
            powerPoints,
            nameVoltPacks,
            powerTable: addItemInUseStateArray<(number | null)[]>(
              powerTable[0].map(() => null)
            )(powerTable),
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
                                },
                                previousData.powerPoints
                              );
                            return {
                              powerPoints: newPowerPoints,
                              powerTable: previousData.powerTable,
                              nameVoltPacks: previousData.nameVoltPacks,
                            };
                          });
                        })}
                        type="number"
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
                                              powerPointIndexs:
                                                n.powerPointIndexs,
                                              name: n.name,
                                            };
                                          } else if (i2 == voltNameIndex) {
                                            return {
                                              source: n.source,
                                              voltIndex: n.voltIndex,
                                              powerPointIndexs: [
                                                ...n.powerPointIndexs,
                                                powerPoints.length,
                                              ],
                                              name: n.name,
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
                                      })(powerPoints);
                                    return {
                                      nameVoltPacks: newNameVoltPacks,
                                      powerPoints: newPowerPoints,
                                      powerTable: newPowerTable,
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
                                    },
                                    previousData.powerPoints
                                  );
                                return {
                                  powerPoints: newPowerPoints,
                                  powerTable: previousData.powerTable,
                                  nameVoltPacks: previousData.nameVoltPacks,
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
      <TextField
        value={JSON.stringify(data)}
        onChange={setTextToString((input) => {
          setData(JSON.parse(input));
        }, true)}
      />
    </main>
  );
}
