We want to add the ability to Annotate over attached images, using react-sketch. A user should be able to then save the annotated image, here is an example from ChatGPT:



To improve the user experience by allowing more dynamic color selections for annotations, you can add a color picker alongside the tool selection. This will enable users to choose different colors for their annotations directly from the modal. Here’s an updated version of the `ImageEditorModal` component incorporating a color picker:



```jsx

import React, { useState } from 'react';

import { Modal } from 'antd'; // Assuming you are using antd for the modal

import { SketchField, Tools } from 'react-sketch';



const ImageEditorModal = ({ previewVisible, setPreviewVisible, previewSrc }) => {

  const [tool, setTool] = useState(Tools.Pencil); // Default tool

  const [lineColor, setLineColor] = useState('#000000'); // Default color for annotations

  const [lineWidth, setLineWidth] = useState(3); // Default line width



  const handleToolChange = (e) => {

    setTool(e.target.value);

  };



  return (

    <Modal

      open={previewVisible}

      width="70%"

      footer={null}

      onCancel={() => setPreviewVisible(false)}

    >

      <React.Fragment>

        {previewSrc && (

          <div>

            <SketchField

              width="100%"

              height="512px"

              tool={tool}

              lineColor={lineColor}

              lineWidth={lineWidth}

              imageSrc={previewSrc}

            />

            <div style={{ marginTop: '10px' }}>

              <label>Tool: </label>

              <select onChange={handleToolChange} value={tool}>

                <option value={Tools.Pencil}>Pencil</option>

                <option value={Tools.Rectangle}>Rectangle</option>

                <option value={Tools.Circle}>Circle</option>

                <option value={Tools.Line}>Line</option>

                <option value={Tools.Select}>Select</option>

                <option value={Tools.Text}>Text</option>

              </select>

              <label style={{ marginLeft: '20px' }}>Color: </label>

              <input

                type="color"

                value={lineColor}

                onChange={(e) => setLineColor(e.target.value)}

              />

              <label style={{ marginLeft: '20px' }}>Line Width: </label>

              <input

                type="range"

                min="1"

                max="10"

                value={lineWidth}

                onChange={(e) => setLineWidth(e.target.value)}

              />

            </div>

          </div>

        )}

      </React.Fragment>

    </Modal>

  );

};



export default ImageEditorModal;

```



### Key Updates:

- **Color Picker**: Added directly next to the tool selection for easy access. This allows users to change the color of their drawing or annotation tool on the fly.

- **Tool and Style Labels**: Added labels for better UI clarity, making it easier for users to understand the options available for modification (tools, color, and line width).



### Additional Considerations:

- **UI Design**: You might want to further style the color picker and the tool selectors to match your application’s look and feel. This can involve CSS styling or using custom components that better fit your design system.

- **Advanced Features**: Depending on your requirements, consider adding more advanced features like opacity control, more drawing tools, or presets for commonly used annotation colors.



This updated component now provides an integrated experience for users to not only select the type of annotation they want to apply but also customize it with different colors and line widths, enhancing the flexibility and usability of your image annotation feature in ProdigyBuild.
