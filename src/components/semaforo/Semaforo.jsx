import { useState, useEffect } from "react";
import Styles from "./semaforo.module.css";

const Semaforo = () => {
  const [ligths, setLights] = useState([
    {
      colorOn: "#FF0000",
      colorOff: "#660000",
      onOff: false,
      changeTime: 5000,
      nameI: "rojo",
    },
    {
      colorOn: "#FFFF00",
      colorOff: "#666600",
      onOff: false,
      changeTime: 2500,
      nameI: "amarillo",
    },
    {
      colorOn: "#00FF00",
      colorOff: "#006600",
      onOff: false,
      changeTime: 4500,
      nameI: "verde",
    },
  ]);
  const [positionCar, setPositionCar] = useState(0);
  const [indexLight, setIndexLight] = useState(0);
  const [clicked, setClicked] = useState(false);

  //funciones

  //reset semaforo
  const resetSemaforo = () => {
    setPositionCar(100);
    setIndexLight(-1);
    setLights([
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
  //funcion que actualiza posicion del auto
  const changePostion = () => {
    let position = positionCar + 15;
    return setPositionCar(position);
  };

  //funcion que actualiza el encendido y apagado de las luces segun el index
  const validateIndex = () => {
    const currentIndex = indexLight;
    setLights((prevLights) =>
      prevLights.map((light, index) => {
        if (currentIndex === index) {
          return { ...light, onOff: true };
        } else {
          return { ...light, onOff: false };
        }
      })
    );
  };
  //funcion que actualiza posicion del arreglo de luces
  const changeIndexLigth = () => {
    return setIndexLight((prevIndex) => (prevIndex + 1) % ligths.length);
  };

  //funcion que detecta sobre que index estoy haciendo click
  const clickIndex = (i) => {
    if (!clicked) {
      if (i !== 1) {
        setLights((prevLights) =>
          prevLights.map((light, index) => {
            if (i === index) {
              return { ...light, onOff: true };
            } else {
              return { ...light, onOff: false };
            }
          })
        );
        setClicked(true);
        setIndexLight(i);
      }
    }
  };

  //use effect que se encarga de de el cambio de luces en el semaforo
  useEffect(() => {
    if (indexLight < 0) {
      return;
    } else {
      validateIndex();
      const changeLigth = setTimeout(() => {
        changeIndexLigth();
      }, ligths[indexLight].changeTime);

      return () => clearTimeout(changeLigth);
    }
  }, [indexLight]);

  //useEffect que se encargade controlar el movimiento del auto
  useEffect(() => {
    const luzVerde = ligths.find((light) => light.nameI === "verde");
    if (luzVerde && luzVerde.onOff) {
      if (positionCar < 100) {
        const movement = setInterval(() => {
          changePostion();
        }, 1000);
        return () => clearTimeout(movement);
      } else {
        resetSemaforo();
      }
    }
  }, [ligths, positionCar]);

  // use Effect que se encarga de state clicked
  useEffect(() => {
    if (positionCar >= 100) {
      setClicked(true);
    } else {
      if (clicked) {
        const timer = setTimeout(() => {
          setClicked(false);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [clicked, positionCar]);

  return (
    <>
      <div className="">
        <div className={`${Styles.semaforoContainer}`}>
          {ligths.map((light, i) => (
            <div
              key={light.nameI}
              className={`${Styles.lightsContainer}`}
              style={{
                backgroundColor: light.onOff ? light.colorOn : light.colorOff,
                cursor: light.nameI === "amarillo" ? "not-allowed" : "pointer",
              }}
              onClick={() => clickIndex(i)}
            ></div>
          ))}
        </div>
        {clicked && positionCar < 100 && (
          <p>el click se desactivara en 5 segundos</p>
        )}
      </div>
      <div className="">
        <div className="">
          <div className={`${Styles.street}`}>
            <div
              className={`${Styles.car}`}
              style={{
                left: `${positionCar === 100 ? positionCar - 5 : positionCar}%`,
              }}
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
