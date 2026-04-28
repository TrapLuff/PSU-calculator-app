import type { Component } from "./types";

const componentsMock: Component[] = [
  {
    id: 1,
    title: 'Процессор Intel Core i5-14600K OEM',
    type: 'CPU',
    image: '',
    video: '',
    tdp_typical: 125,
    tdp_up: 181,
    description: '14-ядерный процессор Intel Core i5-14600K OEM...'
  },
  {
    id: 2,
    title: 'Видеокарта GIGABYTE GeForce RTX 4070 WINDFORCE OC 12G',
    type: 'GPU',
    image: 'components/component-logo_2.png',
    video: 'video.mp4',
    tdp_typical: 200,
    tdp_up: 245,
    description: 'Видеокарта GIGABYTE GeForce RTX 4070...'
  },
  {
    id: 3,
    title: 'Оперативная память Kingston FURY Beast Black 16 GB 5200',
    type: 'RAM',
    image: 'components/component-logo_3.png',
    video: 'video.mp4',
    tdp_typical: 8,
    tdp_up: 8,
    description: 'Оперативная память Kingston FURY Beast...'
  },
  {
    id: 4,
    title: 'Процессор AMD Ryzen 7 5800X OEM',
    type: 'CPU',
    image: 'components/component-logo_4.png',
    video: '',
    tdp_typical: 105,
    tdp_up: 105,
    description: 'Процессор AMD Ryzen 7 5800X OEM...'
  },
  {
    id: 5,
    title: 'Видеокарта GIGABYTE GeForce RTX 3060 WINDFORCE OC 12G',
    type: 'GPU',
    image: 'components/component-logo_5.png',
    video: 'video.mp4',
    tdp_typical: 155,
    tdp_up: 170,
    description: 'Видеокарта GIGABYTE GeForce RTX 3060...'
  },
  {
    id: 6,
    title: 'Накопитель 1000 ГБ M.2 NVMe Kingston NV3',
    type: 'SSD',
    image: 'components/component-logo_6.png',
    video: 'video.mp4',
    tdp_typical: 5,
    tdp_up: 12,
    description: 'SSD-накопитель Kingston NV3...'
  }
];

export const fetchComponents = async (): Promise<Component[]> => {
    return new Promise(resolve => setTimeout(() => resolve(componentsMock), 500));
};

export const fetchComponentById = async (id: number): Promise<Component | undefined> => {
    return new Promise(resolve => setTimeout(() => resolve(componentsMock.find(c => c.id === id)), 500));
};