import React, {useContext} from "react"

import { SurfaceContext } from "@jsplumbtoolkit/browser-ui-react";
import { SvgExporterUI, ImageExporterUI } from "@jsplumbtoolkit/browser-ui"

/**
 * Provides export svg/png/jpg buttons. This component uses the `SurfaceContext` to access a surface instance,
 * and its ShapeLibrary
 */
export default function ExportComponent() {

    const surfaceContext = useContext(SurfaceContext)

    function exportSVG() {
        surfaceContext.listen(s => new SvgExporterUI(s, s.getShapeLibrary()).export({}))
    }

    function exportPNG() {
        // show an image export ui, which will default tp PNG.  `dimensions` is optional - if not supplied the resulting PNG
        // will have the same size as the content.
        surfaceContext.listen(s => new ImageExporterUI(s, s.getShapeLibrary()).export({dimensions:[
                { width:3000}, { width:1200}, {width:800}
            ]}))
    }

    function exportJPG() {
        // show an image export ui targetting a JPG output. Here we show an alternative to providing a list of dimensions - we just mandate the
        // width we want for the output. Again, this is optional. You don't need to provide this or `dimensions`. See note above.
        surfaceContext.listen(s => new ImageExporterUI(s, s.getShapeLibrary()).export({type:"image/jpeg", width:3000}))
    }


    return <div className="jtk-export">
            <span>Export:</span>
            <a href="#" id="exportSvg" onClick={() => exportSVG()}>SVG</a>
            <a href="#" id="exportPng" onClick={() => exportPNG()}>PNG</a>
            <a href="#" id="exportJpg" onClick={() => exportJPG()}>JPG</a>
        </div>
}
