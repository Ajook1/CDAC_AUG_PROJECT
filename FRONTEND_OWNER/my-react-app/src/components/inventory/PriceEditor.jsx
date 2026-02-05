import { updateInventoryPrice } from '../../api/storeApi';

const PriceEditor = ({ item, reload }) => {
    const updatePrice = async (e) => {
        await updateInventoryPrice(item.book_id, Number(e.target.value), item.mrp);
        reload();
    };

    return (
        <input
            type="number"
            className="form-control form-control-sm"
            defaultValue={item.price}
            onBlur={updatePrice}
        />
    );
};

export default PriceEditor;
