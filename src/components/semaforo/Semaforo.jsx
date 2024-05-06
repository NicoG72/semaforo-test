import { useState, useEffect } from "react";
import Styles from "./semaforo.module.css";

const Semaforo = () => {
  const [luces, setLuces] = useState([
    {
      colorOn: "#FF0000",
      colorOff: "#660000",
      onOff: false,
      changeTime: 15000,
      nameI: "rojo",
    },
    {
      colorOn: "#FFFF00",
      colorOff: "#666600",
      onOff: false,
      changeTime: 5000,
      nameI: "amarillo",
    },
    {
      colorOn: "#00FF00",
      colorOff: "#006600",
      onOff: false,
      changeTime: 10000,
      nameI: "verde",
    },
  ]);
  const [positionCar, setPositionCar] = useState(0);
  const [indexLuz, setIndexLuz] = useState(-2);

  //funcion que actualiza posicion del auto
  const changePostion = () => {
    const newPosition = positionCar + 5;
    const maxPosition = 95;
    if (newPosition <= maxPosition) {
      setPositionCar(newPosition);
    }
  };

  //funcion que actualiza los index para el cambio de luces
  const changeLights = () => {
    const nextIndex = (indexLuz + 1) % luces.length;

    setLuces((prevLuces) => {
      return prevLuces.map((light, index) => ({
        ...light,
        onOff: index === nextIndex,
      }));
    });

    setIndexLuz(nextIndex);
  };

  useEffect(() => {
    if (indexLuz < 0) {
      changeLights();
    } else {
      if (positionCar === 95) {
        resetSemaforo();
      } else {
        setTimeout(() => {
          changeLights();
        }, luces[indexLuz].changeTime);
      }
    }
  }, [indexLuz]);

  console.log("index luz: ", indexLuz);
  console.log("posicion del auto: ", positionCar);

  useEffect(() => {
    const luzVerde = luces.find((light) => light.nameI === "verde");
    if (luzVerde && luzVerde.onOff && positionCar < 100) {
      const intervalId = setInterval(() => {
        changePostion();
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [luces, positionCar]);

  //reset Semaforo
  const resetSemaforo = () => {
    setLuces([
      {
        colorOn: "#FF0000",
        colorOff: "#660000",
        onOff: false,
        changeTime: 15000,
        nameI: "rojo",
      },
      {
        colorOn: "#FFFF00",
        colorOff: "#666600",
        onOff: false,
        changeTime: 5000,
        nameI: "amarillo",
      },
      {
        colorOn: "#00FF00",
        colorOff: "#006600",
        onOff: false,
        changeTime: 10000,
        nameI: "verde",
      },
    ]);
  };

  return (
    <>
      <div className="">
        <div className={`${Styles.semaforoContainer}`}>
          {luces.map((light) => (
            <div
              key={light.nameI}
              className={`${Styles.lightsContainer}`}
              style={{
                backgroundColor: light.onOff ? light.colorOn : light.colorOff,
                cursor: light.nameI === "amarillo" ? "not-allowed" : "pointer",
              }}
            ></div>
          ))}
        </div>
      </div>
      <div className="">
        <div className="">
          <button onClick={changeLights}>change light</button>
          <div className={`${Styles.street}`}>
            <div
              className={`${Styles.car}`}
              style={{ left: `${positionCar}%` }}
            >
              auto
            </div>
            <div className={`${Styles.sideWalk}`}>cuadras</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Semaforo;
