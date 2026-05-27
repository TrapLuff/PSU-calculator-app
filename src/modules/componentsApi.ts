import type { Component } from "./types";
const API_URL2 = import.meta.env.VITE_API_URL;
const API_URL = `${API_URL2}/components`;

const componentsMock: Component[] = [
  {
    id: 1,
    title: 'Процессор Intel Core i5-14600K OEM',
    type: 'CPU',
    image: '',
    video: '',
    tdp_typical: 125,
    tdp_up: 181,
    description: "14-core Intel desktop CPU (Raptor Lake). High single-core performance, optimized for gaming, multitasking, and productivity workloads. Socket LGA1700, unlocked multiplier for overclocking.",
    short_description: "14-core Intel desktop CPU (Raptor Lake). High single-core performance, optimized for gaming, multitasking, and productivity workloads. Socket LGA1700, unlocked multiplier for overclocking."
  },
  {
    id: 2,
    title: 'Видеокарта GIGABYTE GeForce RTX 4070 WINDFORCE OC 12G',
    type: 'GPU',
    image: '',
    video: '',
    tdp_typical: 200,
    tdp_up: 245,
    description: 'Видеокарта GIGABYTE GeForce RTX 4070...',
    short_description: "NVIDIA GeForce RTX 4070 graphics card with 12GB GDDR6X memory. Designed for 1440p and 4K gaming, ray tracing, DLSS 3 support, high-end rendering and AI workloads.",
  },
  {
    id: 3,
    title: 'Оперативная память Kingston FURY Beast Black 16 GB 5200',
    type: 'RAM',
    image: '',
    video: '',
    tdp_typical: 8,
    tdp_up: 8,
    description: 'Видеокарта GIGABYTE GeForce RTX 4070...',
    short_description: "16GB DDR5 RAM module Kingston FURY Beast 5200MHz. High-speed memory for modern PC systems, optimized for gaming, content creation, and multitasking performance."
  },
  {
    id: 4,
    title: 'Процессор AMD Ryzen 7 5800X OEM',
    type: 'CPU',
    image: '',
    video: '',
    tdp_typical: 105,
    tdp_up: 105,
    description: 'Видеокарта GIGABYTE GeForce RTX 4070...',
    short_description: "8-core AMD Ryzen 7 5800X desktop processor based on Zen 3 architecture. Excellent multi-thread performance for gaming, streaming, and heavy productivity tasks."
  },
  {
    id: 5,
    title: 'Видеокарта GIGABYTE GeForce RTX 3060 WINDFORCE OC 12G',
    type: 'GPU',
    image: '',
    video: '',
    tdp_typical: 155,
    tdp_up: 170,
    description: 'Видеокарта GIGABYTE GeForce RTX 4070...',
    short_description: "NVIDIA GeForce RTX 3060 GPU with 12GB VRAM. Mid-range graphics card for 1080p and 1440p gaming, efficient rendering performance, supports ray tracing and DLSS."
  },
  {
    id: 6,
    title: 'Накопитель 1000 ГБ M.2 NVMe Kingston NV3',
    type: 'SSD',
    image: '',
    video: '',
    tdp_typical: 5,
    tdp_up: 12,
    description: 'Видеокарта GIGABYTE GeForce RTX 4070...',
    short_description: "1TB M.2 NVMe SSD Kingston NV3. High-speed solid state drive with fast sequential read/write performance, ideal for OS, applications, and game storage."
  }
];

export const fetchComponents = async (filters?: {
    search?: string;
    type?: string;
}): Promise<Component[]> => {
    try {
        const params = new URLSearchParams();

        if (filters?.search) params.append("search", filters.search);
        if (filters?.type) params.append("type", filters.type);

        const res = await fetch(`${API_URL}?${params.toString()}`, {
            cache: "no-store"
        });
        console.log("STATUS:", res.status);

        if (!res.ok) throw new Error("Backend error");

        return await res.json();
    } catch (e) {
        console.warn("Backend not available → using mock");

        // fallback + локальная фильтрация (чтобы поведение совпадало)
        return componentsMock.filter(c => {
            const matchText =
                !filters?.search ||
                c.title.toLowerCase().includes(filters.search.toLowerCase());

            const matchType =
                !filters?.type || c.type === filters.type;

            return matchText && matchType;
        });
    }
};

export const fetchComponentById = async (id: number): Promise<Component | undefined> => {
    try {
        const res = await fetch(`/api/components/${id}`);

        if (!res.ok) throw new Error();

        return await res.json();
    } catch {
        console.warn("Backend not available → using mock");

        return componentsMock.find(c => c.id === id);
    }
};