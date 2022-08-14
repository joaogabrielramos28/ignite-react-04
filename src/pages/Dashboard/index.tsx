import { useEffect, useState } from "react";

import Header from "../../components/Header";
import api from "../../services/api";
import Food, { IFood } from "../../components/Food";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";
import { FoodsContainer } from "./styles";

export const Dashboard = () => {
  const [foods, setFoods] = useState<IFood[]>([]);
  const [editingFood, setEditingFood] = useState<IFood>({} as IFood);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods() {
      const response = await api.get("/foods");

      setFoods(response.data);
    }

    loadFoods();
  }, []);
  async function handleAddFood(food: IFood): Promise<void> {
    try {
      const response = await api.post<IFood>("/foods", food);

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: IFood): Promise<void> {
    const { id, available } = editingFood;

    const response = await api.put(`/foods/${id}`, {
      ...food,
      available,
    });

    const updatedFoods = foods.map((food) => {
      if (food.id === id) {
        return response.data;
      }

      return food;
    });

    setFoods(updatedFoods);
  }
  async function handleDeleteFood(id: number): Promise<void> {
    await api.delete(`/foods/${id}`);

    const updatedFoods = foods.filter((food) => food.id !== id);

    setFoods(updatedFoods);
  }
  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }
  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }
  function handleEditFood(food: IFood): void {
    setEditingFood(food);
    toggleEditModal();
  }
  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food: IFood) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={() => handleEditFood(food)}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
