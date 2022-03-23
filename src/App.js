import formOneJSON from "./formOneElement.json";
import formTwoJSON from "./formTwoElement.json";
import { useState, useEffect } from "react";
import Element from "./components/Element";
import { FormContext } from "./FormContext";

function App() {
  const [elements, setElements] = useState(null);
  const [formOne, setFormOne] = useState(true);
  const { fields, page_label } = elements ?? {};
  const formJSON = formOne ? formOneJSON : formTwoJSON;
  useEffect(() => {
    setElements(formJSON[0]);
  }, [formJSON]);

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(elements);
  };

  const handleChange = (id, event) => {
    const newElements = { ...elements };
    newElements.fields.forEach((field) => {
      const { field_type, field_id } = field;
      if (id === field_id) {
        // hardcoded to fire function only if it's this particular select field. Field-id will always have to be unique in this case because there is no check for specific form JSON.
        if (field_id === "employment" && event.target.value === "Contract") {
          const fn = eval(formJSON[0].function);
          console.log("function from server, ", fn);
          fn(event.target.value);
        }
        if (field)
          switch (field_type) {
            case "checkbox":
              field["field_value"] = event.target.checked;
              break;

            default:
              field["field_value"] = event.target.value;
              break;
          }
      }
      setElements(newElements);
    });
    console.log(elements);
  };

  return (
    <FormContext.Provider value={{ handleChange }}>
      <div className="App container">
        <button onClick={() => setFormOne((prev) => !prev)}>Switch Form</button>
        <h3>{page_label}</h3>
        <form>
          {fields
            ? fields.map((field, i) => <Element key={i} field={field} />)
            : null}
          <button
            type="submit"
            className="btn btn-primary"
            onClick={(e) => handleSubmit(e)}
          >
            Submit
          </button>
        </form>
      </div>
    </FormContext.Provider>
  );
}

export default App;
