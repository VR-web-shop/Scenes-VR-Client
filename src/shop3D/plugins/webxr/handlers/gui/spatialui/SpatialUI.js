import * as THREE from 'three'

import SpatialUIContainer from './elements/SpatialUIContainer.js'
import SpatialUIPaginator from './elements/SpatialUIPaginator.js'
import SpatialUIPanel from './elements/SpatialUIPanel.js'
import SpatialUIGrid from './elements/SpatialUIGrid.js'
import SpatialUIImage from './elements/SpatialUIImage.js'
import SpatialUIText from './elements/SpatialUIText.js'
import SpatialUIButton from './elements/SpatialUIButton.js'

const SpatialUIBuilder = function() {
    const container = new SpatialUIContainer();
    const childContainers = [];
    const panels = [];
    const grids = [];
    const paginators = [];
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

    this.addImage = function(texture, width, height, name='image') {
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

    this.addGridPaginator = function(gridOptions, prevBtnOptions, nextBtnOptions, pagesTextOptions, emptyTextOptions, name='paginator') {
        const grid = new SpatialUIGrid(gridOptions.columns, gridOptions.rows, gridOptions.rowSpacing, gridOptions.columnSpacing);
        const pagesText = new SpatialUIText(pagesTextOptions.text, pagesTextOptions.textOptions, pagesTextOptions.textColor);
        const emptyText = new SpatialUIText(emptyTextOptions.text, emptyTextOptions.textOptions, emptyTextOptions.textColor);
        const prevBtnText = new SpatialUIText(prevBtnOptions.text, prevBtnOptions.textOptions, prevBtnOptions.textColor);
        const nextBtnText = new SpatialUIText(nextBtnOptions.text, nextBtnOptions.textOptions, nextBtnOptions.textColor);
        const prevButton = new SpatialUIButton(prevBtnOptions.width, prevBtnOptions.height, prevBtnOptions.color, prevBtnOptions.hoverColor, prevBtnText);
        const nextButton = new SpatialUIButton(nextBtnOptions.width, nextBtnOptions.height, nextBtnOptions.color, nextBtnOptions.hoverColor, nextBtnText);
        const perPage = gridOptions.columns * gridOptions.rows;
        const paginator = new SpatialUIPaginator(grid, prevButton, nextButton, pagesText, emptyText, perPage);
        paginator.setName(name);
        pagesText.setName(`${name}_pagesText`);
        emptyText.setName(`${name}_emptyText`);
        prevBtnText.setName(`${name}_prevBtnText`);
        nextBtnText.setName(`${name}_nextBtnText`);
        nextButton.setName(`${name}_nextButton`);
        prevButton.setName(`${name}_prevButton`);
        grid.setName(`${name}_grid`);
        container.addElement(paginator);
        paginators.push(paginator);
        return this;
    }

    this.addChildContainerElement = function(element, name='childContainer') {
        element.setName(name);
        container.addElement(element);
        childContainers.push(element);
        return this;
    }

    this.build = function() {
        return {
            container,
            childContainers,
            paginators,
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
    SpatialUIPaginator,
    SpatialUIPanel,
    SpatialUIGrid,
    SpatialUIImage,
    SpatialUIText,
    SpatialUIButton
}
