export default function Item({ item, handleInc, handleDec }) {
  return (
    <div className="card bg-base-100 shadow-xl mb-2">
      <div className="card-body">
        <h2 className="card-title">{item.name}</h2>
        <p>Count: {item.count}</p>
        <p>Price: ${item.price}</p>
        <div className="card-actions justify-end">
          <button
            className="btn btn-primary"
            onClick={() => handleInc(item.id)}
          >
            +
          </button>
          <button
            className="btn btn-primary"
            onClick={() => handleDec(item.id)}
          >
            -
          </button>
        </div>
      </div>
    </div>
  );
}
