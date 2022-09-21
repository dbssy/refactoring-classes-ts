import { useEffect, useState } from 'react';

import api from '../../services/api';

import Header from '../../components/Header';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface FoodData {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

export default function Dashboard() {
  const [foods, setFoods] = useState<FoodData[]>([]);
  const [editingFood, setEditingFood] = useState<FoodData>({} as FoodData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFood() {
      const response = await api.get('/foods');
      setFoods(response.data);
    }

    loadFood();
  }, []);

  async function handleAddFood(food: FoodData) {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: FoodData) {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, { 
        ...editingFood, 
        ...food 
      });

      const foodsUpdated = foods.map(food => ( 
        food.id !== foodUpdated.data.id ? food : foodUpdated.data
      ));

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: Number) {
    await api.get(`/foods/${id}`);
    const foodsFiltered = foods.filter(food => food.id !== id);
    setFoods(foodsFiltered);
  }

  function handleEditFood(food: FoodData) {
    setEditingFood(food);
    setIsEditModalOpen(true);
  }

  function toggleModal() {
    setIsModalOpen(!isModalOpen);
  }

  function toggleEditModal() {
    setIsEditModalOpen(!isEditModalOpen);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={isModalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={isEditModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}