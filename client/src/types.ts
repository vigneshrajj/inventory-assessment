export interface Store {
    ItemID: number;
    ItemName: string;
    Category: string;
    Unit: string;
    Price: number;
    Quantity: number;
    Supplier: string;
    Thumbnail: string;
}

export interface Inventory {
    ItemID: number;
    ItemName: string;
    Category: string;
    Unit: string;
    Price: number;
    Quantity: number;
    Supplier: string;
    Thumbnail: string;
}

export interface InventoryItem {
    ItemID: number;
    Quantity: number;
}