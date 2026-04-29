import React, { useEffect, useState, useRef } from "react";
import { fetchComponents } from "../modules/componentsApi";
import type { Component } from "../modules/types";
import { ComponentCard } from "../components/ComponentCard/ComponentCard";
import { Button } from "react-bootstrap";
import { HeaderComponent } from "../components/Header/Header";
import { ROUTE_LABELS } from "../routes";
import { useComponentSearch } from "../hooks/useComponentSearch";
import { useCart } from "../hooks/useCart";

export const ComponentsList: React.FC = () => {
    const [components, setComponents] = useState<Component[]>([]);


    const [searchValue, setSearchValue] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [filtered, setFiltered] = useState<Component[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const {
        items,
        ready,
        progress,
        searchByImage,
        resetSearch
    } = useComponentSearch(components);

    // 📦 LOAD DATA
    useEffect(() => {
        fetchComponents().then(data => {
            setComponents(data);
            setFiltered(data);
        });
    }, []);

    const handleSearch = () => {
        const result = components.filter(c => {
            const title = c?.title ?? "";
            const type = c?.type ?? "";

            const matchText =
                title.toLowerCase().includes(searchValue.toLowerCase()) ||
                type.toLowerCase().includes(searchValue.toLowerCase());

            const matchType = typeFilter ? c.type === typeFilter : true;

            return matchText && matchType;
        });

        setFiltered(result);
    };


    const displayItems = selectedImage
    ? items
        .filter(i => i.embedding && i.isVisible)
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
    : filtered;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(imageUrl);
        searchByImage(file);
    };

    const handleClear = () => {
        setSelectedImage(null);
        resetSearch();

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const cart = useCart();

    return (
        <main>
            <HeaderComponent
                crumbs={[{ label: ROUTE_LABELS.COMPONENTS }]}
            />

            <hr />

            <div className="body-up">

                <div className="inputField">
                    <input
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Поиск по названию"
                    />

                    <Button onClick={handleSearch}>
                        Поиск
                    </Button>

                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleImageUpload}
                    />
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={!ready}
                    >
                        {ready ? "Поиск по изображению" : "Загрузка модели..."}
                    </Button>

                    <Button
                        variant="outline-danger"
                        onClick={handleClear}
                        disabled={!selectedImage}
                    >
                        Сброс
                    </Button>

                    
                </div>

                

               {cart?.componentsCount > 0 ? (
                    <a className="logo">
                        <img src="/result-logo.png" className="mini-logo" />
                    </a>
                ) : (
                    <div style={{ position: "relative", display: "inline-block" }}>
                    <a className="logo">
                        <img src="/result-logo.png" className="mini-logo" />
                    </a>
                     <span
                        style={{
                            position: "absolute",
                            top: 35,
                            right: 0,
                            background: "orange",
                            color: "white",
                            borderRadius: "50%",
                            fontSize: 12,
                            padding: "2px 6px"
                        }}
                    >
                        {0}
                    </span>
                    </div>
                )}

            
                
            </div>

            {selectedImage && (
                    <img
                        src={selectedImage}
                        alt="preview"
                        style={{ width: 100, marginLeft: 10 }}
                    />
                )}

            <div className="components-container">
                {(displayItems ?? []).length === 0 ? (
                    <div className="component-item">
                        Список пуст
                    </div>
                ) : (
                    displayItems.map(c => (
                        <div key={c.id}>
                            <ComponentCard component={c} />

                            {selectedImage && (
                                <div style={{ fontSize: 12, color: "#666" }}>
                                    Similarity: {(c.score * 100).toFixed(1)}%
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </main>
    );
};