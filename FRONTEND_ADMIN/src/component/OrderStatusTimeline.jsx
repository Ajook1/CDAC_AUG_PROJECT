const steps = ["Pending", "Confirmed", "Shipped", "Delivered"];

const OrderStatusTimeline = ({ status }) => {
  if (status === "Cancelled") {
    return (
      <span className="badge bg-danger px-3 py-2">
        Cancelled
      </span>
    );
  }

  const activeIndex = steps.indexOf(status);

  return (
    <div className="d-flex align-items-center gap-2">
      {steps.map((step, index) => (
        <div key={step} className="d-flex align-items-center gap-2">
          <span
            className={`badge px-3 py-2 ${
              index < activeIndex
                ? "bg-success"
                : index === activeIndex
                ? "bg-primary"
                : "bg-secondary"
            }`}
          >
            {step}
          </span>
          {index < steps.length - 1 && <span>→</span>}
        </div>
      ))}
    </div>
  );
};

export default OrderStatusTimeline;
