import React, { useEffect, useState } from 'react';
import carsData from '../data/cars.json';
import NavigationHeader from '../components/NavigationHeader';
import CardComponent from '../components/CardComponent';
import ToasterProvider from '../providers/ToasterProvider';
import AddButton from '../components/Button/AddButton';
import CarForm from '../components/Form/CarForm';
import usersData from '../data/users.json';
import Car from '../../types/Car';
import User from '../../types/User';
import { toast } from "react-hot-toast";
import BackupButton from '../components/Button/BackupButton';
import {AiFillCar} from 'react-icons/ai'


const CarsPage = () => {
  const [users, setUsers] = useState(usersData.usuarios);
  const [cars, setCars] = useState(carsData.coches);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const isProduction = process.env.NODE_ENV === 'production';

  useEffect(() => {
    if (isProduction) {
      const cachedUsers = localStorage.getItem('users');
      const cachedCars = localStorage.getItem('cars');
      console.log(cachedCars, cachedUsers);

      if (cachedUsers) {
          setUsers(JSON.parse(cachedUsers));
      }

      if (cachedCars) {
          setCars(JSON.parse(cachedCars));
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (isProduction) {
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('cars', JSON.stringify(cars));
        //console.log("Saving on cache")
      }
    }
  }, [users, cars]);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const restoreInitialData = () => {
    setUsers(usersData.usuarios)
    setCars(carsData.coches)
  };

  const addCar = (newCar: Car) => {
    const updatedCars = [...cars, newCar];
    setCars(updatedCars);
  };

  const handleUserSelect = (user?: User | null) => {
    setSelectedUser(user ?? null);
  };

  const checkCarLiked = (carId: number): boolean => {
    if (selectedUser) {
      // console.log(selectedUser.coches_favoritos.includes(carId))
      return selectedUser.coches_favoritos.includes(carId);
    }
    return false;
  };

  const handleDeleteCar = (id: number) => {

    const updatedCars = cars.filter((car) => car.id !== id);
    setCars(updatedCars);

    toast.success('Car deleted!')
  
    const updatedUsers = users.map((user) => {
      const updatedFavoriteCars = user.coches_favoritos.filter((car) => car !== id);
      const updatedUser = { ...user, coches_favoritos: updatedFavoriteCars };
      return updatedUser;
    });
  
    setUsers(updatedUsers);
  };
  

  const handleLikeClick = (carId: number) => {
    if (selectedUser) {
      const userIndex = users.findIndex((user) => user.id === selectedUser.id);
      if (userIndex !== -1) {
        const updatedUsers = [...users];
        const user = updatedUsers[userIndex];
        const likedCars = user.coches_favoritos;

        if (likedCars.includes(carId)) {
          const updatedLikedCars = likedCars.filter((car) => car !== carId);
          user.coches_favoritos = updatedLikedCars;
          toast.success('Car removed from favorites');
        } else {
          if (likedCars.length >= 3){
            toast.error("The maximum number of favorite cars is 3.")
          } else {
            user.coches_favoritos = [...likedCars, carId];
            toast.success('Car added to favorites');
          }
        }
        setUsers(updatedUsers);
      }
    }
  }

  return (
    <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-7 px-4 pb-10">
      <ToasterProvider />
      <NavigationHeader activePage="Cars" primaryText="Users" secondaryText="Cars" />
      <div className="flex justify-center">
        <select
          value={selectedUser ? selectedUser.id : ''}
          onChange={(e) => {
            const selectedUserId = parseInt(e.target.value);
            const user = users.find((user) => user.id === selectedUserId);
            if (user) {
              handleUserSelect(user);
            } else {
              handleUserSelect(null);
            }
          }}
          className="px-4 py-2 border rounded-md"
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-center mt-4">
        <div className="grid grid-cols-1 pt-4">
          {cars.map((car) => (
            <CardComponent
              key={car.id}
              image="/images/ibiza.jpeg"
              content={
                <div className="flex flex-col gap-2">
                  <div className="text-xl font-semibold">{car.nombre}</div>
                  <div>{car.marca}</div>
                </div>
              }
              likeButtonEnabled={!!selectedUser}
              liked={checkCarLiked(car.id)}
              onLiked={() => handleLikeClick(car.id)}
              deleteButtonEnabled
              onDeleted={() => handleDeleteCar(car.id)}
            />
          ))}
        </div>
      </div>
      <AddButton 
        onClick={toggleForm}
        content={(<AiFillCar size={24}/>)}
      />
      {showForm && (
        <CarForm
          cars={cars}
          onToggleForm={toggleForm}
          onAddCar={addCar}
        />
      )}
      <div className="flex justify-center my-10">
        <BackupButton onClick={restoreInitialData}/>
      </div>
    </div>
  );
};

export default CarsPage;
