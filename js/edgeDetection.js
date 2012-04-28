/*
	obtained from nerget.com/edgeDetection

*/
function edge(input, context) {
    var w = input.width, h = input.height;
    //alert("width=" + w + " height=" + h);
    var output = context.createImageData(w, h);
    var inputData = input.data;
    var outputData = output.data;
    var bytesPerRow = w * 4;
    var pixel = bytesPerRow + 4; // Start at (1,1)
    var hm1 = h - 1;
    var wm1 = w - 1;
    {
    	var center = (w - w % 2) /2 + ((h - h % 2) / 2) * w;
    	var center_pixel = center * 4;
    	//alert("w=" + w + " h=" + h + "center_pixel=" + 	center_pixel);
    	var baseR = inputData[center_pixel + 0];
    	var baseG = inputData[center_pixel + 1];
    	var baseB = inputData[center_pixel + 2];
    	var hilR = baseR + 65;
    	var hilG = baseG + 65;
    	var hilB = baseB;
    	//alert("center_pixel=" + center_pixel + " mod=" + (center_pixel % 4) + " r=" + baseR + " g=" + baseG + " b=" + baseB);
    	//alert("r=" + baseR + "; g=" + baseG + "; b=" + baseB + " " + Math.abs(-9));
    }
    
    for (var y = 1; y < hm1; ++y) {
        // Prepare initial cached values for current row

        var centerRow = pixel - 4;
        var priorRow = centerRow - bytesPerRow;
        var nextRow = centerRow + bytesPerRow;

        var r1 = inputData[priorRow]   + inputData[centerRow]   + inputData[nextRow];
        var g1 = inputData[++priorRow] + inputData[++centerRow] + inputData[++nextRow];
        var b1 = inputData[++priorRow] + inputData[++centerRow] + inputData[++nextRow];

        var rp = inputData[priorRow += 2];
        var gp = inputData[++priorRow];
        var bp = inputData[++priorRow];

        var rc = inputData[centerRow += 2];
        var gc = inputData[++centerRow];
        var bc = inputData[++centerRow];

        var rn = inputData[nextRow += 2];
        var gn = inputData[++nextRow];
        var bn = inputData[++nextRow];

        var r2 = rp + rc + rn;
        var g2 = gp + gc + gn;
        var b2 = bp + bc + bn;
        
        // Main convolution loop
        for (var x = 1; x < wm1; ++x) {
            centerRow = pixel + 4;
            priorRow = centerRow - bytesPerRow;
            nextRow = centerRow + bytesPerRow;

            var r = 127 + (rc << 3) - r1 - rp - rn;
            var g = 127 + (gc << 3) - g1 - gp - gn;
            var b = 127 + (bc << 3) - b1 - bp - bn;

            r1 = r2;
            g1 = g2;
            b1 = b2;

            rp = inputData[  priorRow];
            gp = inputData[++priorRow];
            bp = inputData[++priorRow];

            rc = inputData[  centerRow];
            gc = inputData[++centerRow];
            bc = inputData[++centerRow];

            rn = inputData[  nextRow];
            gn = inputData[++nextRow];
            bn = inputData[++nextRow];

            r2 = rp + rc + rn;
            g2 = gp + gc + gn;
            b2 = bp + bc + bn;
            
            var rin = inputData[pixel]
            var gin = inputData[pixel+1];
            var bin = inputData[pixel+2];
            var dif = Math.abs(rin - baseR) + Math.abs(gin - baseG) + Math.abs(bin - baseB);
            if (dif < 36) {
            	outputData[pixel] = hilR;
            	outputData[++pixel] = hilG;
            	outputData[++pixel] = hilB;
            	outputData[++pixel] = 255; 
            } else {
            	outputData[pixel] = rin;
            	outputData[++pixel] = gin;
            	outputData[++pixel] = bin;
            	outputData[++pixel] = 255;
            }
            
/*
            outputData[pixel] = r - r2;
            outputData[++pixel] = g - g2;
            outputData[++pixel] = b - b2;
            outputData[++pixel] = 255; // alpha
            */
            ++pixel;
        }
        pixel += 8;
    }
    //alert("pixels=" + pixel);
    /*
    var base = -1;
    for (var y = 0; y < h; ++y) {
        outputData[++base] = inputData[base];
        outputData[++base] = inputData[base];
        outputData[++base] = inputData[base];
        outputData[++base] = inputData[base];
        base += w * 4 - 8;
        outputData[++base] = inputData[base];
        outputData[++base] = inputData[base];
        outputData[++base] = inputData[base];
        outputData[++base] = inputData[base];
    }
    var top = -1;
    var bottom = -1 + w * (h - 1) * 4;
    for (var x = 0; x < w; x++) {
        outputData[++top] = inputData[top];
        outputData[++top] = inputData[top];
        outputData[++top] = inputData[top];
        outputData[++top] = inputData[top];
        outputData[++bottom] = inputData[bottom];
        outputData[++bottom] = inputData[bottom];
        outputData[++bottom] = inputData[bottom];
        outputData[++bottom] = inputData[bottom];
    }*/
    return {data: output, 
    		color: {r: baseR, 
    				g: baseG, 
    				b: baseB}
    		};
}

