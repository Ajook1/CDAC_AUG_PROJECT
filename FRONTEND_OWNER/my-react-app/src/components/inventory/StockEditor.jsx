import { updateInventoryStock } from '../../api/storeApi';

const StockEditor = ({ item, reload }) => {
    const updateStock = async (e) => {
        await updateInventoryStock(item.book_id, Number(e.target.value));
        reload();
    };

    return (
        <input
            type="number"
            className="form-control form-control-sm"
            defaultValue={item.stock_quantity}
            onBlur={updateStock}
        />
    );
};

export default StockEditor;
