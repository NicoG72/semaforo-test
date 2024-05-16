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
  const [velocity, setVelocity] = useState(1);
  const [clicked, setClicked] = useState(false);
  const [finishGame, setFinishGame] = useState(false);

  //funciones

  //reset semaforo
  const resetSemaforo = () => {
    setPositionCar(100);
    setIndexLight(-1);
    setFinishGame(true);
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
    let position = positionCar + Number(velocity);
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
    console.log(positionCar);
  }, [clicked, positionCar]);

  //Cambio de velocidad

  const addVelocity = () => {
    setVelocity((prevVelocity) => prevVelocity + 1);
  };
  const lessVelocity = () => {
    if (velocity > 1) {
      setVelocity((prevVelocity) => prevVelocity - 1);
    } else return;
  };

  const onChangeVelocity = (e) => {
    setVelocity(e.target.value);
  };

  const onBlurVelocity = () => {
    setVelocity(velocity === "" ? 0 : Number(velocity));
  };

  //funcion de reset Game

  const resetGame = () => {
    if (finishGame) {
      setTimeout(() => {
        setFinishGame(false);
        setClicked(false);
        setPositionCar(0);
        setIndexLight(0);
        setVelocity(1);
      }, 3000);
    }
  };

  return (
    <>
      <div className={`${Styles.containerTrafficLigth}`}>
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
        <div className="">
          <h2>Tablero de control de velocidad</h2>
          <div className={`${Styles.containerVelocityBoard}`}>
            <div className="">
              <p className={`${Styles.labelTt}`}>Current velocity</p>
              <input
                type="number"
                className={`${Styles.inputVelocity}`}
                value={velocity}
                onChange={onChangeVelocity}
                onBlur={onBlurVelocity}
              />
            </div>
            <div className="">
              <button
                className={`${Styles.btnVelocityLess}`}
                onClick={() => lessVelocity()}
              >
                -
              </button>
              <button
                className={`${Styles.btnVelocityMore}`}
                onClick={() => addVelocity()}
              >
                +
              </button>
            </div>
          </div>
          <div className="">
            {finishGame && (
              <button
                className={`${Styles.btnReset}`}
                onClick={() => resetGame()}
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
      {clicked && positionCar < 100 && !finishGame && (
        <p>el click se desactivara en 5 segundos</p>
      )}
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
