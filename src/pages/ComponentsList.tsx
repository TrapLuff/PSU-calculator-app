import React, { useEffect, useState } from "react";
import { fetchComponents } from "../modules/componentsApi";
import type { Component } from "../modules/types";
import { ComponentCard } from "../components/ComponentCard";
import { Button } from "react-bootstrap";
import { HeaderComponent } from "../components/Header";
import { ROUTE_LABELS } from "../routes";

export const ComponentsList: React.FC = () => { 
    const [components, setComponents] = useState<Component[]>([]);
    const [filtered, setFiltered] = useState<Component[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [typeFilter, setTypeFilter] = useState("");

    useEffect(() => {
        fetchComponents().then(data => {setComponents(data); setFiltered(data);});
    }, []);

    const handleSearch = () => {
        setLoading(true);

        const result = components.filter(c =>
            (c.title.toLowerCase().includes(searchValue.toLowerCase()) || c.type.toLowerCase().includes(searchValue.toLowerCase())) &&
            (typeFilter ? c.type === typeFilter : true)
        );

        setFiltered(result);
        setLoading(false);
    };

    return (
        <main>
            <HeaderComponent
            crumbs={[
                { label: ROUTE_LABELS.COMPONENTS }
            ]}/>
            <hr />
            {/* Поиск */}
            <div className="body-up">
                <div className="inputField">
                    <input value={searchValue} onChange={(event => setSearchValue(event.target.value))} placeholder="Найти"/>
                    <Button disabled={loading} onClick={handleSearch}>Обновить</Button>
                </div>
                <a className="logo">
                    <img src="/result-logo.png" className="mini-logo" />
                </a>
            </div>
            {/* Список */}
            <div className="components-container">
                {filtered.length === 0 ? (
                    <div className="component-item">Список пуст</div>
                ) : (
                    filtered.map(c => (
                        <ComponentCard key={c.id} component={c} />
                    ))
                )}
            </div>
        </main>
    );
};