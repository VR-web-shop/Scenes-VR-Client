import * as THREE from 'three'

import SpatialUIContainer from './elements/SpatialUIContainer.js'
import SpatialUIPanel from './elements/SpatialUIPanel.js'
import SpatialUIGrid from './elements/SpatialUIGrid.js'
import SpatialUIImage from './elements/SpatialUIImage.js'
import SpatialUIText from './elements/SpatialUIText.js'
import SpatialUIButton from './elements/SpatialUIButton.js'

const SpatialUIBuilder = function() {
    const container = new SpatialUIContainer();
    const panels = [];
    const grids = [];
    const images = [];
    const texts = [];
    const buttons = [];

    this.addPanel = function(width, height, color, name='panel') {
        const panel = new SpatialUIPanel(width, height, color);
        panel.setName(name);
        container.addElement(panel);
        panels.push(panel);
        return this;
    }

    this.addGrid = function(columns, rows, rowSpacing, columnSpacing, name='grid') {
        const grid = new SpatialUIGrid(columns, rows, rowSpacing, columnSpacing);
        grid.setName(name);
        container.addElement(grid);
        grids.push(grid);
        return this;
    }

    this.addImage = async function(src, width, height, name='image') {
        const texture = await SpatialUIImage.loadTexture(src);
        const image = new SpatialUIImage(texture, width, height);
        image.setName(name);
        container.addElement(image);
        images.push(image);
        return this;
    }

    this.addText = function(text, textOptions, color, name='text') {
        const textElement = new SpatialUIText(text, textOptions, color);
        textElement.setName(name);
        container.addElement(textElement);
        texts.push(textElement);
        return this;
    }

    this.addButton = function(width, height, color, hoverColor, text, textOptions, textColor, name='button') {
        const spatialUIText = new SpatialUIText(text, textOptions, textColor);
        const button = new SpatialUIButton(width, height, color, hoverColor, spatialUIText);
        button.setName(name);
        container.addElement(button);
        buttons.push(button);
        return this;
    }

    this.build = function() {
        return {
            container,
            panels,
            grids,
            images,
            texts,
            buttons
        }
    }
}

export default {
    SpatialUIBuilder,
    SpatialUIContainer,
    SpatialUIPanel,
    SpatialUIGrid,
    SpatialUIImage,
    SpatialUIText,
    SpatialUIButton
}
