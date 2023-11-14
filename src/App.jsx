import React from "react";
import { produce } from "immer";

const SIZES = [
  { slug: "sm", label: 'Small (10")' },
  { slug: "md", label: 'Medium (12")' },
  { slug: "lg", label: 'Large (14")' },
  { slug: "xl", label: 'Pizza For Days (16")' },
];
const TOPPINGS = [
  { slug: "anchovies", label: "Anchovies" },
  { slug: "mushrooms", label: "Mushrooms" },
  { slug: "green-pepper", label: "Green Pepper" },
  { slug: "onions", label: "Onions" },
  { slug: "pineapple", label: "Pineapple" },
  { slug: "pepperoni", label: "Pepperoni" },
  { slug: "sausage", label: "Sausage" },
  { slug: "chicken", label: "Chicken" },
  { slug: "bacon", label: "Bacon" },
  { slug: "feta", label: "Feta" },
  { slug: "provolone", label: "Provolone" },
  { slug: "gummy-bears", label: "Gummy Bears" },
  { slug: "popcorn", label: "Popcorn" },
  { slug: "lucky-charms", label: "Lucky Charms" },
  { slug: "ice-cream", label: "Vanilla Ice Cream" },
  { slug: "cotton-candy", label: "Cotton Candy" },
];

const DefaultState = {
  size: SIZES[0].slug,

  toppings: TOPPINGS.map((topping) => {
    return {
      ...topping,
      selected: false,
    };
  }),
};

const reducer = (formState, action) => {
  return produce(formState, (draftState) => {
    switch (action.type) {
      case "change-size": {
        draftState.size = action.slug;
        break;
      }

      case "toggle-topping": {
        draftState.toppings[action.index].selected = action.selected;
        break;
      }

      case "toggle-all": {
        const countSelected = formState.toppings.filter(({ selected }) =>
          Boolean(selected)
        ).length;
        draftState.toppings = TOPPINGS.map((topping) => {
          return {
            ...topping,
            selected: countSelected !== TOPPINGS.length,
          };
        });
        break;
      }
    }
  });
};

function OrderPizza() {
  const id = React.useId();

  const [formState, dispatch] = React.useReducer(reducer, DefaultState);

  const countPizza = React.useMemo(() => {
    return formState.toppings.filter(({ selected }) => Boolean(selected))
      .length;
  }, [formState.toppings]);

  const allSelected = countPizza === TOPPINGS.length;

  function handleSubmit(event) {
    event.preventDefault();

    alert(
      `You have selected ${countPizza} toppings on your ${formState.size} pizza`
    );

    // TODO: call window.alert() with the selected toppings.
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Your order</h2>
      <fieldset>
        <legend>Select size:</legend>
        <div className="size">
          {SIZES.map(({ slug, label }) => {
            const inputId = `${slug}`;

            return (
              <label key={inputId} htmlFor={inputId}>
                <input
                  id={inputId}
                  type="radio"
                  name={`${id}-size-group`}
                  checked={formState?.size === slug}
                  value={slug}
                  onChange={() => {
                    dispatch({
                      type: "change-size",
                      slug,
                    });
                  }}
                />
                {label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend>Select your pizza toppings:</legend>
        <div className="toppings">
          {TOPPINGS.map(({ slug, label }, index) => {
            const inputId = `topping-${id}-${slug}`;

            return (
              <label key={inputId} htmlFor={inputId}>
                <input
                  id={inputId}
                  type="checkbox"
                  checked={formState?.toppings[index].selected}
                  value={slug}
                  onChange={() => {
                    dispatch({
                      type: "toggle-topping",
                      index,
                      selected: !formState?.toppings[index].selected,
                    });
                  }}
                />
                {label}
              </label>
            );
          })}
        </div>
        <div className="topping-actions">
          <button
            type="button"
            onClick={() => {
              dispatch({
                type: "toggle-all",
              });
            }}
          >
            {allSelected ? "De Select" : "Select"} All
          </button>
        </div>
      </fieldset>

      <div className="actions">
        <button>Order pizza</button>
      </div>
    </form>
  );
}

export default OrderPizza;
