import React, { useEffect, useState, useRef } from "react";
import { fetchComponents } from "../modules/componentsApi";
import type { Component } from "../modules/types";
import { ComponentCard } from "../components/ComponentCard/ComponentCard";
import { Button } from "react-bootstrap";
import { HeaderComponent } from "../components/Header/Header";
import { ROUTE_LABELS } from "../routes";
import { useComponentSearch } from "../hooks/useComponentSearch";
//import { useCart } from "../hooks/useCart";
import { Link } from "react-router-dom";


import { fetchCartAsync } from "../slices/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";

import {
  setSearchValue,
  //setTypeFilter,
  setSelectedImage,
  clearFilters,
  setAppliedSearch  
} from "../slices/ComponentsListSlice";

export const ComponentsList: React.FC = () => {

    console.log(import.meta.env.VITE_API_URL);
  const dispatch = useDispatch<AppDispatch>();

  //const componentsRef = React.useRef<Component[]>([]);

  const [components, setComponents] = useState<Component[]>([]);

  //  Redux filters
  const searchValue = useSelector(
    (state: RootState) => state.filters.searchValue
  );

  const typeFilter = useSelector(   
    (state: RootState) => state.filters.typeFilter
  );

  const selectedImage = useSelector(
    (state: RootState) => state.filters.selectedImage
  );

  const appliedSearch = useSelector(
  (state: RootState) => state.filters.appliedSearch
);

  const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        //items,
        ready,
        //progress,
        searchByImage,
        resetSearch
    } = useComponentSearch(components);

    //  LOAD DATA удалил
    useEffect(() => {
        fetchComponents().then(data => {
            setComponents(data);
        });
    }, []);

    

    const handleSearch = () => {
  dispatch(setAppliedSearch());
};

    const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
    );

    useEffect(() => {
  if (!isAuthenticated) {
    fetchComponents().then(data => {
      setComponents(data);
    });

    dispatch(clearFilters());
  }
}, [isAuthenticated]);



   const displayItems = React.useMemo(() => {
  if (!components) return [];

  let result = [...components];

  const search = appliedSearch.toLowerCase().trim();

result = result.filter(c => {
  const title = c?.title ?? "";
  const type = c?.type ?? "";

  const matchText =
    search.length === 0
      ? true
      : title.toLowerCase().includes(search) ||
        type.toLowerCase().includes(search);

  const matchType = typeFilter ? c.type === typeFilter : true;

  return matchText && matchType;
});

  return result;
}, [components, appliedSearch, typeFilter]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const imageUrl = URL.createObjectURL(file);
        dispatch(setSelectedImage(imageUrl));
        searchByImage(file);
    };

    const handleClear = () => {
        dispatch(setSelectedImage(null));
        resetSearch();

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    
    const cart = useSelector((state: RootState) => state.cart);

  useEffect(() => {
  dispatch(fetchCartAsync());
}, [dispatch]);

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
                        onChange={(e) =>
                        dispatch(setSearchValue(e.target.value))
                        }
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

                

               {cart?.componentsCount == 0 ? (
                    <a className="logo">
                        <img src={import.meta.env.BASE_URL + "/no-result-logo.png"} className="mini-logo" />
                    </a>
                ) : (
                    <div style={{ position: "relative", display: "inline-block" }}>
                    <Link to={`/powers/${cart.draftId}`} className="logo">
                        <img src={import.meta.env.BASE_URL + "/result-logo.png"} className="mini-logo" />
                    </Link>
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
                        {cart?.componentsCount ?? 0}
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
                                    Similarity: {(/*c.score * */100).toFixed(1)}%
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </main>
    );
};