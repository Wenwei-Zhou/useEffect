import { useRef, useState, useEffect, useCallback } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import {sortPlacesByDistance} from './loc.js';

const storeIds = JSON.parse(localStorage.getItem('selectedPlace')) || [];
  // 获取所有以前存储的ID，这些都是已经被picked的places
const storedPlaces = storeIds.map((id) => 
  AVAILABLE_PLACES.find((place) => place.id === id)
);
// 用map()列出已经被picked的places

function App() {
  const selectedPlace = useRef();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [availablePlaces, setAvailablePlacses] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES, 
        position.coords.latitude,
        position.coords.longitude
      );

      setAvailablePlacses(sortedPlaces);
    });
  }, []);

  
  // 当我们调用这个方法时, 用户将被要求获得其位置的权限, 然后一旦授予该权限, 它将继续获取此位置｡
  // 提供用户的纬度和经度坐标

  function handleStartRemovePlace(id) {
    setModalIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    const storeIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    // 获取所有以前存储的ID

    if (storeIds.indexOf(id) === -1) {
      localStorage.setItem('selectedPlaces', JSON.stringify([id, ...storeIds]));
    }
    // storeIds.indexOf(id) === -1，检查是否已经有这个id了，在indexOf()里面，等于-1就相当于return -1，意思就是没有这个id

    // localStorage允许我们使用setItem方法将一些数据存储在浏览器的存储中, 如果我们离开网站并稍后返回, 或者如果我们重新加载网站, 这些数据也将可用｡
    // 您只需向setItem传递一个标识符,例如selectedPlaces,然后作为第二个参数传递应该存储的值｡尽管有必要提及, 但这些数据必须是字符串格式,所以你不能存储数组或对象, 相反, 数据必须首先转换为字符串,
  }

  const handleRemovePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setModalIsOpen(false);

    const storeIds = JSON.parse(localStorage.getItem('selectedPlace')) || []; // 获取所有以前存储的ID
    localStorage.setItem('selectedPlaces', JSON.stringify(storeIds.filter((id) => id !== selectedPlace.current)));
    // 过滤器方法基本上内置在浏览器中, 它允许我们基于这个数组和一些过滤条件生成一个新数组
    // 对于那个过滤器, 它接受一个函数, 这个函数将对这个数组中的每一个元素执行,
    // 并将把每一个元素作为这个函数的输入｡
    // 然后我们必须返回true, 如果我们想保留该项目,
    // 如果我们想删除它, 则返回false｡
    // 因此, 在这里, 我将简单地检查我在这里看到的ID是否不等于'selectedPlace｡
    // 这只是我在第一个框中点击的地方的ID｡
    // current',
    // 所以如果这两个ID不匹配,
    // 我知道这不是我想删除的项, 因此我返回true并保留该项｡
    // 但是如果这些ID匹配,
    // 则这里的条件将产生false,
    // 并且该ID将从该数组中删除｡
    // 这就是我们如何存储一个更新后的数组,
    // 它不再包含这个ID｡
  }, []);
  // 你应该在将函数作为依赖项传递给useEffect时使用useCallback｡
  // React现在只会在依赖项发生变化时使用useCallback重新创建这个函数｡
  // 没有添加依赖项，function就不会创新执行。依赖项应该添加prop或state值。
  

  return (
    <>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText={"Sorting place by distance..."}
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
