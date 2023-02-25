import React from 'react';

import { Canvas } from './Canvas';

function App() {
    const [properties, setProperties] = React.useState({
        dots: true,
        arrows: true,
        rangeFinders: true,
        pins: true,
    });

    const handleOnCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProperties((properties) => ({
            ...properties,
            [e.target.name]: e.target.checked,
        }));
    };

    return (
        <>
            <Canvas
                dots={properties.dots}
                arrows={properties.arrows}
                rangeFinders={properties.rangeFinders}
                pins={properties.pins}
            />
            <div>
                {Object.keys(properties).map((key) => (
                    <label key={key}>
                        <input
                            name={key}
                            type="checkbox"
                            checked={properties[key as keyof typeof properties]}
                            onChange={handleOnCheckChange}
                        />
                        <span style={{ textTransform: 'capitalize' }}>{key}</span>
                    </label>
                ))}
            </div>
        </>
    );
}

export default App;
