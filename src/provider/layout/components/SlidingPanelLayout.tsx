import React from 'react';
import clsx from 'clsx';

interface SlidingPanelLayoutProps {
    isOpen: boolean;
    onClose?: () => void;
    children: React.ReactNode;
    position?: 'left' | 'right';
    width?: string;
}

const SlidingPanelLayout: React.FC<SlidingPanelLayoutProps> = ({
    isOpen,
    onClose,
    children,
    position = 'right',
    width = '360px',
}) => {
    return (
        <div className="relative z-40">
            <div
                className={clsx(
                    'fixed inset-0 ',
                    isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                )}
                onClick={onClose}
            />

            <div
                className={clsx(
                    'fixed top-0 h-full bg-white shadow-md transition-all duration-300 ease-in-out',
                    position === 'right' ? 'right-0' : 'left-[82px]',
                    isOpen ? `translate-x-0` : position === 'right' ? 'translate-x-full' : '-translate-x-full'
                )}
                style={{ width }}
            >
                <div className="h-full overflow-y-auto p-6">{children}</div>
            </div>
        </div>
    );
};

export default SlidingPanelLayout;
