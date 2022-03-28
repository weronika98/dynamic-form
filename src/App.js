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
      const {
        field_type,
        field_id,
        functionDefinition: {
          functionTrigger,
          functionType,
          targetField,
          targetFieldValue,
          newFieldDefinition: {
            newField_id,
            newField_label,
            newField_mandatory,
            newField_placeholder,
            newField_type,
            newField_value,
          } = {},
        } = {},
      } = field;
      if (id === field_id) {
        // checks for a functionTrigger property (this signifies current field may trigger a function), if it exists and the value that tiggers the function execution is the same  as the value user selected - function will run
        if (functionTrigger && event.target.value === functionTrigger) {
          // Types of different funtions/actions will have to be hardcoded to know how to structure the function properly and what values will be exctracted from the dynamic form object
          if (functionType === "populate") {
            const copyElements = { ...elements };
            const changedFieldIndex = copyElements.fields.findIndex(
              (field) => field.field_id === targetField
            );
            let changedField = copyElements.fields.filter(
              (field) => field.field_id === targetField
            );
            changedField[0]["field_value"] = targetFieldValue;
            newElements.fields.splice(changedFieldIndex, 1, changedField[0]);
            //populates a dynamic value to a dynamically spefied field
          }
          if (functionType === "exposeField") {
            // generates a new dynamic field
            const newField = {
              field_id: newField_id,
              field_label: newField_label,
              field_mandatory: newField_mandatory,
              field_placeholder: newField_placeholder,
              field_type: newField_type,
              field_value: newField_value,
            };
            newElements.fields.push(newField);
          }
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

//"function": "() => { let elementsCopy = {...elements} let fieldToPopulate = elementsCopy.//fields.filter(field => field.field_id === 'name') fieldToPopulate[0].field_value = 'TEST'}",
