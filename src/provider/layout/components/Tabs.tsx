import clsx from "clsx";

interface TabItem {
    id: string;
    label: string;
    icon: React.ReactNode;
}

interface TabsProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
    tabs: TabItem[];
}

const Tabs = ({ activeTab, onTabChange, tabs }: TabsProps) => {
    return (
        <div className="border-t border-gray-300 pt-4 mb-6 text-center">
            <div className="flex justify-center gap-12 text-sm font-medium text-gray-500">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={clsx(
                            "flex items-center gap-1 pb-2 border-b-2",
                            activeTab === tab.id
                                ? "text-black border-black"
                                : "text-gray-400 border-transparent hover:text-black"
                        )}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Tabs;
