type Props = {
  selectedPrice?: number;
  onChange: (value?: number) => void;
};

const PriceFilter = ({ selectedPrice, onChange }: Props) => {
  return (
    <div>
      <h4 className="text-md font-semibold mb-2">Cena maksymalna</h4>
      <select
      className="p-2 border rounded-md w-full"
        value={selectedPrice}
        onChange={(event) =>
          onChange(
            event.target.value ? parseInt(event.target.value) : undefined
          )
        }
      >
        <option value="">Wybierz cenę maksymalną</option>
        {[100, 200, 300, 400, 500, 600, 700, 800].map(
          (price) => (
            <option value={price}>{price}</option>
          )
        )}
      </select>
    </div>
  );
};

export default PriceFilter;
