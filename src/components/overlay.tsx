import React, { FC } from 'react';
import Button from './button';

type OverlayProps = {
    onClose: () => void;
    title: string;
    closeButtonText: string;
    children: React.ReactNode
};

const Overlay: FC<OverlayProps> = ({ onClose, children, closeButtonText, title }) => (
    <div
        onClick={() => onClose()}
        className="bg-black fixed inset-0 bg-opacity-60 flex items-center justify-center backdrop-blur z-20 h-screen"
    >
        <div
            onClick={(e) => {
                if ((e.target as HTMLElement).tagName !== 'A') {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }}
            className="max-h-[80%] w-full md:max-w-md lg:max-w-lg flex flex-col m-2 mt-4 shadow-md rounded-md"
        >
            <div className="text-center text-lg font-bold p-2">{title}</div>
            {children}
            <div className="flex justify-center p-2">
                <Button className='w-full' onClick={() => onClose()}>{closeButtonText}</Button>
            </div>
        </div>
    </div>
);

export default Overlay;
