

    
  
    (function( jQuery ){
  // var $module = jQuery('#m-1769583405281').children('.module');
  // You can add custom Javascript code right here.
})( window.GemQuery || jQuery );
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    (function( jQuery ){
    var $module = jQuery('#m-1669363303368').children('.module');
    var $collectionFilter = $module.find('.gf_collection-filter');
    var $sortCollection = $module.find('.gf_sort-collection');
    
    var mode = jQuery('.gryffeditor').hasClass('editing') ? 'dev' : 'production';

    var resizeSelect = function() {
        var $collectionFilterRuler = jQuery('<select><option></option></select>');
        var $sortCollectionRuler = jQuery('<select><option></option></select>');

        if ($collectionFilter.find('option:selected').length > 0) {
            $collectionFilterRuler.find('option').html($collectionFilter.find('option:selected').text());
        } else {
            $collectionFilterRuler.find('option').html($collectionFilter.find('option:first').text());
        }
        
        $collectionFilterRuler.css({'width': 'auto','height': '0','opacity':'0','border': '0', 'display': 'block'}).appendTo($module.find('.gf_collection-filter-wrapper'));
        
        if ($sortCollection.find('option:selected').length > 0) {
            $sortCollectionRuler.find('option').html($sortCollection.find('option:selected').text());
        } else {
            $sortCollectionRuler.find('option').html($sortCollection.find('option:first').text());
        }
        $sortCollectionRuler.css({'width': 'auto','height': '0','opacity':'0','border': '0', 'display': 'block'}).appendTo($module.find('.gf_sort-collection-wrapper'));
        var collectionFilterWidth = $collectionFilterRuler.width() + $collectionFilter.outerWidth() - $collectionFilter.width();
        var sortCollectionWidth = $sortCollectionRuler.width() + $sortCollection.outerWidth() - $sortCollection.width();
        
        if (collectionFilterWidth > sortCollectionWidth) {
            $collectionFilter.css('width', collectionFilterWidth);
            $sortCollection.css('width', collectionFilterWidth);
        } else {
            $collectionFilter.css('width', sortCollectionWidth);
            $sortCollection.css('width', sortCollectionWidth);
        }

        $collectionFilterRuler.remove();
        $sortCollectionRuler.remove(); 
    }

    resizeSelect();

    // Collection Filter
    $collectionFilter.bind('change', function(e) {
        if (mode == 'dev') {
            resizeSelect();
        } else {
            var tag = jQuery(this).val();
            
            var currentLocation = window.location.href;
            
            var baseUrl = currentLocation.slice(0, currentLocation.indexOf('/collections/'));
            var tailUrl = currentLocation.slice(currentLocation.indexOf('/collections/') + '/collections/'.length);
            var collectionName = tailUrl.slice(0, tailUrl.indexOf('?') == -1 ? undefined : tailUrl.indexOf('?'));
            var collectionName = collectionName.slice(0, collectionName.indexOf('/') == -1 ? undefined : collectionName.indexOf('/'));
            var query = location.search;
            query = query.replace(/page=\d*/ig ,'').replace('?&', '?').replace('&&', '&')

            window.location.href = baseUrl + '/collections/' + collectionName + ((tag == undefined || tag == '') ? '' : ('/' + tag)) + query;
            
        }
    });

    // Sort Collection
    $sortCollection.bind('change', function(e) {
        if (mode == 'dev') {
            resizeSelect();
        } else {
            var newSortBy = e.target.value;
            var currentSearch = location.search;
            var sortRegex = /sort_by=[\w-]+/ig;

            if (sortRegex.test(currentSearch)) {
                if (newSortBy != '') {
                    currentSearch = currentSearch.replace(sortRegex, 'sort_by=' + newSortBy);
                } else {
                    currentSearch = currentSearch.replace(sortRegex, '');
                    while (currentSearch.indexOf('&&') != -1) {
                        currentSearch.replace('&&', '&');
                    }
                }
            } else if (currentSearch == '' || currentSearch == '?') {
                currentSearch = '?sort_by=' + newSortBy;
            } else {
                currentSearch += ('&sort_by=' + newSortBy);
            }

            location.search = currentSearch;
        }
    });
})( window.GemQuery || jQuery );
  
    (function( jQuery ){
  var $module = jQuery('#m-1669363568541').children('.module');

  var sameHeightTitle = $module.data('sameheightitle'),
  spacing = $module.data('spacing');
  collg = $module.data('collg'),
  colmd = $module.data('colmd'),
  colsm = $module.data('colsm'),
  colxs = $module.data('colxs');

  var $clearfixes = $module.find('.gf_row-no-padding').children('.gf_clearfix');
  var col = collg;

  jQuery(window).resize(function() {
    setTimeout(function() {
      for(var i = 0; i < $clearfixes.length; i++) {
        if($clearfixes.eq(i).css('display') == 'block') {
          if($clearfixes.eq(i).hasClass('visible-lg')) {
            col = collg;
            break;
          }
          if($clearfixes.eq(i).hasClass('visible-md')) {
            col = colmd;
            break;
          }
          if($clearfixes.eq(i).hasClass('visible-sm')) {
            col = colsm;
            break;
          }
          if($clearfixes.eq(i).hasClass('visible-xs')) {
            col = colxs;
            break;
          }
        }
      }
    }, 1000);
  });

  jQuery($module).css('padding', spacing);
})( window.GemQuery || jQuery );
  
    
  
    (function( jQuery ){
  var $module = jQuery('#m-1669363568541-child1').children('.module');
  $module.gfV3Product();
})( window.GemQuery || jQuery );
  
    
  (function(jQuery) {
  var $module = jQuery('#m-1669363568541-child1-7').children('.module');
  var effect = $module.attr('data-effect');
  var magnify = $module.attr('data-zoom-level');
  var displayType = $module.attr('data-displaytype');
  $module.gfV3ProductImage({
    'effect': effect,
    'displayType': displayType,
    'magnify': magnify
  });
  
  /* Custom code hide badge on the product that has no discount */
  var $product = $module.closest('[data-label="Product"]').children('.module');
  if ($product.length === 0) {
  	$product = $module.closest('[data-icon="gpicon-product"]').children('.module');
  }
  if($product.length > 0){
    if ($product.data('gfv3product') !== undefined) {
    	var selectedVariant = $product.data('gfv3product').getVariant();
    	customBadge(selectedVariant);
    }
  }
  
  function changeVariantFunction(variant){
  	customBadge(variant);
  }
  
  var currentWrapProductId = jQuery('[data-label="Product"]').attr('id');
  if (window.GEMSTORE) {
  	window.GEMSTORE.subscribe("product-"+currentWrapProductId+"-variant", changeVariantFunction);
  }
  
  function customBadge(variant){
  	var currentPrice = variant.price;
  	var comparePrice = variant.compare_at_price;
  	if(currentPrice !== null && comparePrice !== null){
  		if(currentPrice < comparePrice){
  			diff = comparePrice - currentPrice;
  		}else{
  			diff = currentPrice - comparePrice;
  		}
  		if(diff <= 0){
  			$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  		}else{
  			$product.find('.gf_product-badge-anchor').css({'display': 'block'});
  		}
  	}else{
  		$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  	}
  }
  /* End custom code */

})(window.GemQuery || jQuery);
    
  
    (function(jQuery) {
    var $module = jQuery('#m-1669363568541-child1-2').children('.module');
    $module.gfV3ProductPrice({
        displayCurrency: true
    });
})(window.GemQuery || jQuery);
  
    (function( jQuery ){
  var $module = jQuery('#m-1669363568541-child2').children('.module');
  $module.gfV3Product();
})( window.GemQuery || jQuery );
  
    
  (function(jQuery) {
  var $module = jQuery('#m-1669363568541-child2-7').children('.module');
  var effect = $module.attr('data-effect');
  var magnify = $module.attr('data-zoom-level');
  var displayType = $module.attr('data-displaytype');
  $module.gfV3ProductImage({
    'effect': effect,
    'displayType': displayType,
    'magnify': magnify
  });
  
  /* Custom code hide badge on the product that has no discount */
  var $product = $module.closest('[data-label="Product"]').children('.module');
  if ($product.length === 0) {
  	$product = $module.closest('[data-icon="gpicon-product"]').children('.module');
  }
  if($product.length > 0){
    if ($product.data('gfv3product') !== undefined) {
    	var selectedVariant = $product.data('gfv3product').getVariant();
    	customBadge(selectedVariant);
    }
  }
  
  function changeVariantFunction(variant){
  	customBadge(variant);
  }
  
  var currentWrapProductId = jQuery('[data-label="Product"]').attr('id');
  if (window.GEMSTORE) {
  	window.GEMSTORE.subscribe("product-"+currentWrapProductId+"-variant", changeVariantFunction);
  }
  
  function customBadge(variant){
  	var currentPrice = variant.price;
  	var comparePrice = variant.compare_at_price;
  	if(currentPrice !== null && comparePrice !== null){
  		if(currentPrice < comparePrice){
  			diff = comparePrice - currentPrice;
  		}else{
  			diff = currentPrice - comparePrice;
  		}
  		if(diff <= 0){
  			$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  		}else{
  			$product.find('.gf_product-badge-anchor').css({'display': 'block'});
  		}
  	}else{
  		$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  	}
  }
  /* End custom code */

})(window.GemQuery || jQuery);
    
  
    (function(jQuery) {
    var $module = jQuery('#m-1669363568541-child2-2').children('.module');
    $module.gfV3ProductPrice({
        displayCurrency: true
    });
})(window.GemQuery || jQuery);
  
    (function( jQuery ){
  var $module = jQuery('#m-1669363568541-child3').children('.module');
  $module.gfV3Product();
})( window.GemQuery || jQuery );
  
    
  (function(jQuery) {
  var $module = jQuery('#m-1669363568541-child3-7').children('.module');
  var effect = $module.attr('data-effect');
  var magnify = $module.attr('data-zoom-level');
  var displayType = $module.attr('data-displaytype');
  $module.gfV3ProductImage({
    'effect': effect,
    'displayType': displayType,
    'magnify': magnify
  });
  
  /* Custom code hide badge on the product that has no discount */
  var $product = $module.closest('[data-label="Product"]').children('.module');
  if ($product.length === 0) {
  	$product = $module.closest('[data-icon="gpicon-product"]').children('.module');
  }
  if($product.length > 0){
    if ($product.data('gfv3product') !== undefined) {
    	var selectedVariant = $product.data('gfv3product').getVariant();
    	customBadge(selectedVariant);
    }
  }
  
  function changeVariantFunction(variant){
  	customBadge(variant);
  }
  
  var currentWrapProductId = jQuery('[data-label="Product"]').attr('id');
  if (window.GEMSTORE) {
  	window.GEMSTORE.subscribe("product-"+currentWrapProductId+"-variant", changeVariantFunction);
  }
  
  function customBadge(variant){
  	var currentPrice = variant.price;
  	var comparePrice = variant.compare_at_price;
  	if(currentPrice !== null && comparePrice !== null){
  		if(currentPrice < comparePrice){
  			diff = comparePrice - currentPrice;
  		}else{
  			diff = currentPrice - comparePrice;
  		}
  		if(diff <= 0){
  			$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  		}else{
  			$product.find('.gf_product-badge-anchor').css({'display': 'block'});
  		}
  	}else{
  		$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  	}
  }
  /* End custom code */

})(window.GemQuery || jQuery);
    
  
    (function(jQuery) {
    var $module = jQuery('#m-1669363568541-child3-2').children('.module');
    $module.gfV3ProductPrice({
        displayCurrency: true
    });
})(window.GemQuery || jQuery);
  
    (function( jQuery ){
  var $module = jQuery('#m-1669363568541-child4').children('.module');
  $module.gfV3Product();
})( window.GemQuery || jQuery );
  
    
  (function(jQuery) {
  var $module = jQuery('#m-1669363568541-child4-7').children('.module');
  var effect = $module.attr('data-effect');
  var magnify = $module.attr('data-zoom-level');
  var displayType = $module.attr('data-displaytype');
  $module.gfV3ProductImage({
    'effect': effect,
    'displayType': displayType,
    'magnify': magnify
  });
  
  /* Custom code hide badge on the product that has no discount */
  var $product = $module.closest('[data-label="Product"]').children('.module');
  if ($product.length === 0) {
  	$product = $module.closest('[data-icon="gpicon-product"]').children('.module');
  }
  if($product.length > 0){
    if ($product.data('gfv3product') !== undefined) {
    	var selectedVariant = $product.data('gfv3product').getVariant();
    	customBadge(selectedVariant);
    }
  }
  
  function changeVariantFunction(variant){
  	customBadge(variant);
  }
  
  var currentWrapProductId = jQuery('[data-label="Product"]').attr('id');
  if (window.GEMSTORE) {
  	window.GEMSTORE.subscribe("product-"+currentWrapProductId+"-variant", changeVariantFunction);
  }
  
  function customBadge(variant){
  	var currentPrice = variant.price;
  	var comparePrice = variant.compare_at_price;
  	if(currentPrice !== null && comparePrice !== null){
  		if(currentPrice < comparePrice){
  			diff = comparePrice - currentPrice;
  		}else{
  			diff = currentPrice - comparePrice;
  		}
  		if(diff <= 0){
  			$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  		}else{
  			$product.find('.gf_product-badge-anchor').css({'display': 'block'});
  		}
  	}else{
  		$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  	}
  }
  /* End custom code */

})(window.GemQuery || jQuery);
    
  
    (function(jQuery) {
    var $module = jQuery('#m-1669363568541-child4-2').children('.module');
    $module.gfV3ProductPrice({
        displayCurrency: true
    });
})(window.GemQuery || jQuery);
  
    (function( jQuery ){
  var $module = jQuery('#m-1669363568541-child5').children('.module');
  $module.gfV3Product();
})( window.GemQuery || jQuery );
  
    
  (function(jQuery) {
  var $module = jQuery('#m-1669363568541-child5-7').children('.module');
  var effect = $module.attr('data-effect');
  var magnify = $module.attr('data-zoom-level');
  var displayType = $module.attr('data-displaytype');
  $module.gfV3ProductImage({
    'effect': effect,
    'displayType': displayType,
    'magnify': magnify
  });
  
  /* Custom code hide badge on the product that has no discount */
  var $product = $module.closest('[data-label="Product"]').children('.module');
  if ($product.length === 0) {
  	$product = $module.closest('[data-icon="gpicon-product"]').children('.module');
  }
  if($product.length > 0){
    if ($product.data('gfv3product') !== undefined) {
    	var selectedVariant = $product.data('gfv3product').getVariant();
    	customBadge(selectedVariant);
    }
  }
  
  function changeVariantFunction(variant){
  	customBadge(variant);
  }
  
  var currentWrapProductId = jQuery('[data-label="Product"]').attr('id');
  if (window.GEMSTORE) {
  	window.GEMSTORE.subscribe("product-"+currentWrapProductId+"-variant", changeVariantFunction);
  }
  
  function customBadge(variant){
  	var currentPrice = variant.price;
  	var comparePrice = variant.compare_at_price;
  	if(currentPrice !== null && comparePrice !== null){
  		if(currentPrice < comparePrice){
  			diff = comparePrice - currentPrice;
  		}else{
  			diff = currentPrice - comparePrice;
  		}
  		if(diff <= 0){
  			$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  		}else{
  			$product.find('.gf_product-badge-anchor').css({'display': 'block'});
  		}
  	}else{
  		$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  	}
  }
  /* End custom code */

})(window.GemQuery || jQuery);
    
  
    (function(jQuery) {
    var $module = jQuery('#m-1669363568541-child5-2').children('.module');
    $module.gfV3ProductPrice({
        displayCurrency: true
    });
})(window.GemQuery || jQuery);
  
    (function( jQuery ){
  var $module = jQuery('#m-1669363568541-child6').children('.module');
  $module.gfV3Product();
})( window.GemQuery || jQuery );
  
    
  (function(jQuery) {
  var $module = jQuery('#m-1669363568541-child6-7').children('.module');
  var effect = $module.attr('data-effect');
  var magnify = $module.attr('data-zoom-level');
  var displayType = $module.attr('data-displaytype');
  $module.gfV3ProductImage({
    'effect': effect,
    'displayType': displayType,
    'magnify': magnify
  });
  
  /* Custom code hide badge on the product that has no discount */
  var $product = $module.closest('[data-label="Product"]').children('.module');
  if ($product.length === 0) {
  	$product = $module.closest('[data-icon="gpicon-product"]').children('.module');
  }
  if($product.length > 0){
    if ($product.data('gfv3product') !== undefined) {
    	var selectedVariant = $product.data('gfv3product').getVariant();
    	customBadge(selectedVariant);
    }
  }
  
  function changeVariantFunction(variant){
  	customBadge(variant);
  }
  
  var currentWrapProductId = jQuery('[data-label="Product"]').attr('id');
  if (window.GEMSTORE) {
  	window.GEMSTORE.subscribe("product-"+currentWrapProductId+"-variant", changeVariantFunction);
  }
  
  function customBadge(variant){
  	var currentPrice = variant.price;
  	var comparePrice = variant.compare_at_price;
  	if(currentPrice !== null && comparePrice !== null){
  		if(currentPrice < comparePrice){
  			diff = comparePrice - currentPrice;
  		}else{
  			diff = currentPrice - comparePrice;
  		}
  		if(diff <= 0){
  			$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  		}else{
  			$product.find('.gf_product-badge-anchor').css({'display': 'block'});
  		}
  	}else{
  		$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  	}
  }
  /* End custom code */

})(window.GemQuery || jQuery);
    
  
    (function(jQuery) {
    var $module = jQuery('#m-1669363568541-child6-2').children('.module');
    $module.gfV3ProductPrice({
        displayCurrency: true
    });
})(window.GemQuery || jQuery);
  
    (function( jQuery ){
  var $module = jQuery('#m-1669363568541-child7').children('.module');
  $module.gfV3Product();
})( window.GemQuery || jQuery );
  
    
  (function(jQuery) {
  var $module = jQuery('#m-1669363568541-child7-7').children('.module');
  var effect = $module.attr('data-effect');
  var magnify = $module.attr('data-zoom-level');
  var displayType = $module.attr('data-displaytype');
  $module.gfV3ProductImage({
    'effect': effect,
    'displayType': displayType,
    'magnify': magnify
  });
  
  /* Custom code hide badge on the product that has no discount */
  var $product = $module.closest('[data-label="Product"]').children('.module');
  if ($product.length === 0) {
  	$product = $module.closest('[data-icon="gpicon-product"]').children('.module');
  }
  if($product.length > 0){
    if ($product.data('gfv3product') !== undefined) {
    	var selectedVariant = $product.data('gfv3product').getVariant();
    	customBadge(selectedVariant);
    }
  }
  
  function changeVariantFunction(variant){
  	customBadge(variant);
  }
  
  var currentWrapProductId = jQuery('[data-label="Product"]').attr('id');
  if (window.GEMSTORE) {
  	window.GEMSTORE.subscribe("product-"+currentWrapProductId+"-variant", changeVariantFunction);
  }
  
  function customBadge(variant){
  	var currentPrice = variant.price;
  	var comparePrice = variant.compare_at_price;
  	if(currentPrice !== null && comparePrice !== null){
  		if(currentPrice < comparePrice){
  			diff = comparePrice - currentPrice;
  		}else{
  			diff = currentPrice - comparePrice;
  		}
  		if(diff <= 0){
  			$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  		}else{
  			$product.find('.gf_product-badge-anchor').css({'display': 'block'});
  		}
  	}else{
  		$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  	}
  }
  /* End custom code */

})(window.GemQuery || jQuery);
    
  
    (function(jQuery) {
    var $module = jQuery('#m-1669363568541-child7-2').children('.module');
    $module.gfV3ProductPrice({
        displayCurrency: true
    });
})(window.GemQuery || jQuery);
  
    (function( jQuery ){
  var $module = jQuery('#m-1669363568541-child8').children('.module');
  $module.gfV3Product();
})( window.GemQuery || jQuery );
  
    
  (function(jQuery) {
  var $module = jQuery('#m-1669363568541-child8-7').children('.module');
  var effect = $module.attr('data-effect');
  var magnify = $module.attr('data-zoom-level');
  var displayType = $module.attr('data-displaytype');
  $module.gfV3ProductImage({
    'effect': effect,
    'displayType': displayType,
    'magnify': magnify
  });
  
  /* Custom code hide badge on the product that has no discount */
  var $product = $module.closest('[data-label="Product"]').children('.module');
  if ($product.length === 0) {
  	$product = $module.closest('[data-icon="gpicon-product"]').children('.module');
  }
  if($product.length > 0){
    if ($product.data('gfv3product') !== undefined) {
    	var selectedVariant = $product.data('gfv3product').getVariant();
    	customBadge(selectedVariant);
    }
  }
  
  function changeVariantFunction(variant){
  	customBadge(variant);
  }
  
  var currentWrapProductId = jQuery('[data-label="Product"]').attr('id');
  if (window.GEMSTORE) {
  	window.GEMSTORE.subscribe("product-"+currentWrapProductId+"-variant", changeVariantFunction);
  }
  
  function customBadge(variant){
  	var currentPrice = variant.price;
  	var comparePrice = variant.compare_at_price;
  	if(currentPrice !== null && comparePrice !== null){
  		if(currentPrice < comparePrice){
  			diff = comparePrice - currentPrice;
  		}else{
  			diff = currentPrice - comparePrice;
  		}
  		if(diff <= 0){
  			$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  		}else{
  			$product.find('.gf_product-badge-anchor').css({'display': 'block'});
  		}
  	}else{
  		$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  	}
  }
  /* End custom code */

})(window.GemQuery || jQuery);
    
  
    (function(jQuery) {
    var $module = jQuery('#m-1669363568541-child8-2').children('.module');
    $module.gfV3ProductPrice({
        displayCurrency: true
    });
})(window.GemQuery || jQuery);
  
    (function( jQuery ){
  var $module = jQuery('#m-1669363568541-child9').children('.module');
  $module.gfV3Product();
})( window.GemQuery || jQuery );
  
    
  (function(jQuery) {
  var $module = jQuery('#m-1669363568541-child9-7').children('.module');
  var effect = $module.attr('data-effect');
  var magnify = $module.attr('data-zoom-level');
  var displayType = $module.attr('data-displaytype');
  $module.gfV3ProductImage({
    'effect': effect,
    'displayType': displayType,
    'magnify': magnify
  });
  
  /* Custom code hide badge on the product that has no discount */
  var $product = $module.closest('[data-label="Product"]').children('.module');
  if ($product.length === 0) {
  	$product = $module.closest('[data-icon="gpicon-product"]').children('.module');
  }
  if($product.length > 0){
    if ($product.data('gfv3product') !== undefined) {
    	var selectedVariant = $product.data('gfv3product').getVariant();
    	customBadge(selectedVariant);
    }
  }
  
  function changeVariantFunction(variant){
  	customBadge(variant);
  }
  
  var currentWrapProductId = jQuery('[data-label="Product"]').attr('id');
  if (window.GEMSTORE) {
  	window.GEMSTORE.subscribe("product-"+currentWrapProductId+"-variant", changeVariantFunction);
  }
  
  function customBadge(variant){
  	var currentPrice = variant.price;
  	var comparePrice = variant.compare_at_price;
  	if(currentPrice !== null && comparePrice !== null){
  		if(currentPrice < comparePrice){
  			diff = comparePrice - currentPrice;
  		}else{
  			diff = currentPrice - comparePrice;
  		}
  		if(diff <= 0){
  			$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  		}else{
  			$product.find('.gf_product-badge-anchor').css({'display': 'block'});
  		}
  	}else{
  		$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  	}
  }
  /* End custom code */

})(window.GemQuery || jQuery);
    
  
    (function(jQuery) {
    var $module = jQuery('#m-1669363568541-child9-2').children('.module');
    $module.gfV3ProductPrice({
        displayCurrency: true
    });
})(window.GemQuery || jQuery);
  
    (function( jQuery ){
  var $module = jQuery('#m-1669363568541-child10').children('.module');
  $module.gfV3Product();
})( window.GemQuery || jQuery );
  
    
  (function(jQuery) {
  var $module = jQuery('#m-1669363568541-child10-7').children('.module');
  var effect = $module.attr('data-effect');
  var magnify = $module.attr('data-zoom-level');
  var displayType = $module.attr('data-displaytype');
  $module.gfV3ProductImage({
    'effect': effect,
    'displayType': displayType,
    'magnify': magnify
  });
  
  /* Custom code hide badge on the product that has no discount */
  var $product = $module.closest('[data-label="Product"]').children('.module');
  if ($product.length === 0) {
  	$product = $module.closest('[data-icon="gpicon-product"]').children('.module');
  }
  if($product.length > 0){
    if ($product.data('gfv3product') !== undefined) {
    	var selectedVariant = $product.data('gfv3product').getVariant();
    	customBadge(selectedVariant);
    }
  }
  
  function changeVariantFunction(variant){
  	customBadge(variant);
  }
  
  var currentWrapProductId = jQuery('[data-label="Product"]').attr('id');
  if (window.GEMSTORE) {
  	window.GEMSTORE.subscribe("product-"+currentWrapProductId+"-variant", changeVariantFunction);
  }
  
  function customBadge(variant){
  	var currentPrice = variant.price;
  	var comparePrice = variant.compare_at_price;
  	if(currentPrice !== null && comparePrice !== null){
  		if(currentPrice < comparePrice){
  			diff = comparePrice - currentPrice;
  		}else{
  			diff = currentPrice - comparePrice;
  		}
  		if(diff <= 0){
  			$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  		}else{
  			$product.find('.gf_product-badge-anchor').css({'display': 'block'});
  		}
  	}else{
  		$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  	}
  }
  /* End custom code */

})(window.GemQuery || jQuery);
    
  
    (function(jQuery) {
    var $module = jQuery('#m-1669363568541-child10-2').children('.module');
    $module.gfV3ProductPrice({
        displayCurrency: true
    });
})(window.GemQuery || jQuery);
  
    (function( jQuery ){
  var $module = jQuery('#m-1669363568541-child11').children('.module');
  $module.gfV3Product();
})( window.GemQuery || jQuery );
  
    
  (function(jQuery) {
  var $module = jQuery('#m-1669363568541-child11-7').children('.module');
  var effect = $module.attr('data-effect');
  var magnify = $module.attr('data-zoom-level');
  var displayType = $module.attr('data-displaytype');
  $module.gfV3ProductImage({
    'effect': effect,
    'displayType': displayType,
    'magnify': magnify
  });
  
  /* Custom code hide badge on the product that has no discount */
  var $product = $module.closest('[data-label="Product"]').children('.module');
  if ($product.length === 0) {
  	$product = $module.closest('[data-icon="gpicon-product"]').children('.module');
  }
  if($product.length > 0){
    if ($product.data('gfv3product') !== undefined) {
    	var selectedVariant = $product.data('gfv3product').getVariant();
    	customBadge(selectedVariant);
    }
  }
  
  function changeVariantFunction(variant){
  	customBadge(variant);
  }
  
  var currentWrapProductId = jQuery('[data-label="Product"]').attr('id');
  if (window.GEMSTORE) {
  	window.GEMSTORE.subscribe("product-"+currentWrapProductId+"-variant", changeVariantFunction);
  }
  
  function customBadge(variant){
  	var currentPrice = variant.price;
  	var comparePrice = variant.compare_at_price;
  	if(currentPrice !== null && comparePrice !== null){
  		if(currentPrice < comparePrice){
  			diff = comparePrice - currentPrice;
  		}else{
  			diff = currentPrice - comparePrice;
  		}
  		if(diff <= 0){
  			$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  		}else{
  			$product.find('.gf_product-badge-anchor').css({'display': 'block'});
  		}
  	}else{
  		$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  	}
  }
  /* End custom code */

})(window.GemQuery || jQuery);
    
  
    (function(jQuery) {
    var $module = jQuery('#m-1669363568541-child11-2').children('.module');
    $module.gfV3ProductPrice({
        displayCurrency: true
    });
})(window.GemQuery || jQuery);
  
    (function( jQuery ){
  var $module = jQuery('#m-1669363568541-child12').children('.module');
  $module.gfV3Product();
})( window.GemQuery || jQuery );
  
    
  (function(jQuery) {
  var $module = jQuery('#m-1669363568541-child12-7').children('.module');
  var effect = $module.attr('data-effect');
  var magnify = $module.attr('data-zoom-level');
  var displayType = $module.attr('data-displaytype');
  $module.gfV3ProductImage({
    'effect': effect,
    'displayType': displayType,
    'magnify': magnify
  });
  
  /* Custom code hide badge on the product that has no discount */
  var $product = $module.closest('[data-label="Product"]').children('.module');
  if ($product.length === 0) {
  	$product = $module.closest('[data-icon="gpicon-product"]').children('.module');
  }
  if($product.length > 0){
    if ($product.data('gfv3product') !== undefined) {
    	var selectedVariant = $product.data('gfv3product').getVariant();
    	customBadge(selectedVariant);
    }
  }
  
  function changeVariantFunction(variant){
  	customBadge(variant);
  }
  
  var currentWrapProductId = jQuery('[data-label="Product"]').attr('id');
  if (window.GEMSTORE) {
  	window.GEMSTORE.subscribe("product-"+currentWrapProductId+"-variant", changeVariantFunction);
  }
  
  function customBadge(variant){
  	var currentPrice = variant.price;
  	var comparePrice = variant.compare_at_price;
  	if(currentPrice !== null && comparePrice !== null){
  		if(currentPrice < comparePrice){
  			diff = comparePrice - currentPrice;
  		}else{
  			diff = currentPrice - comparePrice;
  		}
  		if(diff <= 0){
  			$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  		}else{
  			$product.find('.gf_product-badge-anchor').css({'display': 'block'});
  		}
  	}else{
  		$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  	}
  }
  /* End custom code */

})(window.GemQuery || jQuery);
    
  
    (function(jQuery) {
    var $module = jQuery('#m-1669363568541-child12-2').children('.module');
    $module.gfV3ProductPrice({
        displayCurrency: true
    });
})(window.GemQuery || jQuery);
  
    (function( jQuery ){
  var $module = jQuery('#m-1669363568541-child13').children('.module');
  $module.gfV3Product();
})( window.GemQuery || jQuery );
  
    
  (function(jQuery) {
  var $module = jQuery('#m-1669363568541-child13-7').children('.module');
  var effect = $module.attr('data-effect');
  var magnify = $module.attr('data-zoom-level');
  var displayType = $module.attr('data-displaytype');
  $module.gfV3ProductImage({
    'effect': effect,
    'displayType': displayType,
    'magnify': magnify
  });
  
  /* Custom code hide badge on the product that has no discount */
  var $product = $module.closest('[data-label="Product"]').children('.module');
  if ($product.length === 0) {
  	$product = $module.closest('[data-icon="gpicon-product"]').children('.module');
  }
  if($product.length > 0){
    if ($product.data('gfv3product') !== undefined) {
    	var selectedVariant = $product.data('gfv3product').getVariant();
    	customBadge(selectedVariant);
    }
  }
  
  function changeVariantFunction(variant){
  	customBadge(variant);
  }
  
  var currentWrapProductId = jQuery('[data-label="Product"]').attr('id');
  if (window.GEMSTORE) {
  	window.GEMSTORE.subscribe("product-"+currentWrapProductId+"-variant", changeVariantFunction);
  }
  
  function customBadge(variant){
  	var currentPrice = variant.price;
  	var comparePrice = variant.compare_at_price;
  	if(currentPrice !== null && comparePrice !== null){
  		if(currentPrice < comparePrice){
  			diff = comparePrice - currentPrice;
  		}else{
  			diff = currentPrice - comparePrice;
  		}
  		if(diff <= 0){
  			$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  		}else{
  			$product.find('.gf_product-badge-anchor').css({'display': 'block'});
  		}
  	}else{
  		$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  	}
  }
  /* End custom code */

})(window.GemQuery || jQuery);
    
  
    (function(jQuery) {
    var $module = jQuery('#m-1669363568541-child13-2').children('.module');
    $module.gfV3ProductPrice({
        displayCurrency: true
    });
})(window.GemQuery || jQuery);
  
    (function( jQuery ){
  var $module = jQuery('#m-1669363568541-child14').children('.module');
  $module.gfV3Product();
})( window.GemQuery || jQuery );
  
    
  (function(jQuery) {
  var $module = jQuery('#m-1669363568541-child14-7').children('.module');
  var effect = $module.attr('data-effect');
  var magnify = $module.attr('data-zoom-level');
  var displayType = $module.attr('data-displaytype');
  $module.gfV3ProductImage({
    'effect': effect,
    'displayType': displayType,
    'magnify': magnify
  });
  
  /* Custom code hide badge on the product that has no discount */
  var $product = $module.closest('[data-label="Product"]').children('.module');
  if ($product.length === 0) {
  	$product = $module.closest('[data-icon="gpicon-product"]').children('.module');
  }
  if($product.length > 0){
    if ($product.data('gfv3product') !== undefined) {
    	var selectedVariant = $product.data('gfv3product').getVariant();
    	customBadge(selectedVariant);
    }
  }
  
  function changeVariantFunction(variant){
  	customBadge(variant);
  }
  
  var currentWrapProductId = jQuery('[data-label="Product"]').attr('id');
  if (window.GEMSTORE) {
  	window.GEMSTORE.subscribe("product-"+currentWrapProductId+"-variant", changeVariantFunction);
  }
  
  function customBadge(variant){
  	var currentPrice = variant.price;
  	var comparePrice = variant.compare_at_price;
  	if(currentPrice !== null && comparePrice !== null){
  		if(currentPrice < comparePrice){
  			diff = comparePrice - currentPrice;
  		}else{
  			diff = currentPrice - comparePrice;
  		}
  		if(diff <= 0){
  			$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  		}else{
  			$product.find('.gf_product-badge-anchor').css({'display': 'block'});
  		}
  	}else{
  		$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  	}
  }
  /* End custom code */

})(window.GemQuery || jQuery);
    
  
    (function(jQuery) {
    var $module = jQuery('#m-1669363568541-child14-2').children('.module');
    $module.gfV3ProductPrice({
        displayCurrency: true
    });
})(window.GemQuery || jQuery);
  
    (function( jQuery ){
  var $module = jQuery('#m-1669363568541-child15').children('.module');
  $module.gfV3Product();
})( window.GemQuery || jQuery );
  
    
  (function(jQuery) {
  var $module = jQuery('#m-1669363568541-child15-7').children('.module');
  var effect = $module.attr('data-effect');
  var magnify = $module.attr('data-zoom-level');
  var displayType = $module.attr('data-displaytype');
  $module.gfV3ProductImage({
    'effect': effect,
    'displayType': displayType,
    'magnify': magnify
  });
  
  /* Custom code hide badge on the product that has no discount */
  var $product = $module.closest('[data-label="Product"]').children('.module');
  if ($product.length === 0) {
  	$product = $module.closest('[data-icon="gpicon-product"]').children('.module');
  }
  if($product.length > 0){
    if ($product.data('gfv3product') !== undefined) {
    	var selectedVariant = $product.data('gfv3product').getVariant();
    	customBadge(selectedVariant);
    }
  }
  
  function changeVariantFunction(variant){
  	customBadge(variant);
  }
  
  var currentWrapProductId = jQuery('[data-label="Product"]').attr('id');
  if (window.GEMSTORE) {
  	window.GEMSTORE.subscribe("product-"+currentWrapProductId+"-variant", changeVariantFunction);
  }
  
  function customBadge(variant){
  	var currentPrice = variant.price;
  	var comparePrice = variant.compare_at_price;
  	if(currentPrice !== null && comparePrice !== null){
  		if(currentPrice < comparePrice){
  			diff = comparePrice - currentPrice;
  		}else{
  			diff = currentPrice - comparePrice;
  		}
  		if(diff <= 0){
  			$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  		}else{
  			$product.find('.gf_product-badge-anchor').css({'display': 'block'});
  		}
  	}else{
  		$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  	}
  }
  /* End custom code */

})(window.GemQuery || jQuery);
    
  
    (function(jQuery) {
    var $module = jQuery('#m-1669363568541-child15-2').children('.module');
    $module.gfV3ProductPrice({
        displayCurrency: true
    });
})(window.GemQuery || jQuery);
  
    (function( jQuery ){
  var $module = jQuery('#m-1669363568541-child16').children('.module');
  $module.gfV3Product();
})( window.GemQuery || jQuery );
  
    
  (function(jQuery) {
  var $module = jQuery('#m-1669363568541-child16-7').children('.module');
  var effect = $module.attr('data-effect');
  var magnify = $module.attr('data-zoom-level');
  var displayType = $module.attr('data-displaytype');
  $module.gfV3ProductImage({
    'effect': effect,
    'displayType': displayType,
    'magnify': magnify
  });
  
  /* Custom code hide badge on the product that has no discount */
  var $product = $module.closest('[data-label="Product"]').children('.module');
  if ($product.length === 0) {
  	$product = $module.closest('[data-icon="gpicon-product"]').children('.module');
  }
  if($product.length > 0){
    if ($product.data('gfv3product') !== undefined) {
    	var selectedVariant = $product.data('gfv3product').getVariant();
    	customBadge(selectedVariant);
    }
  }
  
  function changeVariantFunction(variant){
  	customBadge(variant);
  }
  
  var currentWrapProductId = jQuery('[data-label="Product"]').attr('id');
  if (window.GEMSTORE) {
  	window.GEMSTORE.subscribe("product-"+currentWrapProductId+"-variant", changeVariantFunction);
  }
  
  function customBadge(variant){
  	var currentPrice = variant.price;
  	var comparePrice = variant.compare_at_price;
  	if(currentPrice !== null && comparePrice !== null){
  		if(currentPrice < comparePrice){
  			diff = comparePrice - currentPrice;
  		}else{
  			diff = currentPrice - comparePrice;
  		}
  		if(diff <= 0){
  			$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  		}else{
  			$product.find('.gf_product-badge-anchor').css({'display': 'block'});
  		}
  	}else{
  		$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  	}
  }
  /* End custom code */

})(window.GemQuery || jQuery);
    
  
    (function(jQuery) {
    var $module = jQuery('#m-1669363568541-child16-2').children('.module');
    $module.gfV3ProductPrice({
        displayCurrency: true
    });
})(window.GemQuery || jQuery);
  
    (function( jQuery ){
  var $module = jQuery('#m-1669363568541-child17').children('.module');
  $module.gfV3Product();
})( window.GemQuery || jQuery );
  
    
  (function(jQuery) {
  var $module = jQuery('#m-1669363568541-child17-7').children('.module');
  var effect = $module.attr('data-effect');
  var magnify = $module.attr('data-zoom-level');
  var displayType = $module.attr('data-displaytype');
  $module.gfV3ProductImage({
    'effect': effect,
    'displayType': displayType,
    'magnify': magnify
  });
  
  /* Custom code hide badge on the product that has no discount */
  var $product = $module.closest('[data-label="Product"]').children('.module');
  if ($product.length === 0) {
  	$product = $module.closest('[data-icon="gpicon-product"]').children('.module');
  }
  if($product.length > 0){
    if ($product.data('gfv3product') !== undefined) {
    	var selectedVariant = $product.data('gfv3product').getVariant();
    	customBadge(selectedVariant);
    }
  }
  
  function changeVariantFunction(variant){
  	customBadge(variant);
  }
  
  var currentWrapProductId = jQuery('[data-label="Product"]').attr('id');
  if (window.GEMSTORE) {
  	window.GEMSTORE.subscribe("product-"+currentWrapProductId+"-variant", changeVariantFunction);
  }
  
  function customBadge(variant){
  	var currentPrice = variant.price;
  	var comparePrice = variant.compare_at_price;
  	if(currentPrice !== null && comparePrice !== null){
  		if(currentPrice < comparePrice){
  			diff = comparePrice - currentPrice;
  		}else{
  			diff = currentPrice - comparePrice;
  		}
  		if(diff <= 0){
  			$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  		}else{
  			$product.find('.gf_product-badge-anchor').css({'display': 'block'});
  		}
  	}else{
  		$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  	}
  }
  /* End custom code */

})(window.GemQuery || jQuery);
    
  
    (function(jQuery) {
    var $module = jQuery('#m-1669363568541-child17-2').children('.module');
    $module.gfV3ProductPrice({
        displayCurrency: true
    });
})(window.GemQuery || jQuery);
  
    (function( jQuery ){
  var $module = jQuery('#m-1669363568541-child18').children('.module');
  $module.gfV3Product();
})( window.GemQuery || jQuery );
  
    
  (function(jQuery) {
  var $module = jQuery('#m-1669363568541-child18-7').children('.module');
  var effect = $module.attr('data-effect');
  var magnify = $module.attr('data-zoom-level');
  var displayType = $module.attr('data-displaytype');
  $module.gfV3ProductImage({
    'effect': effect,
    'displayType': displayType,
    'magnify': magnify
  });
  
  /* Custom code hide badge on the product that has no discount */
  var $product = $module.closest('[data-label="Product"]').children('.module');
  if ($product.length === 0) {
  	$product = $module.closest('[data-icon="gpicon-product"]').children('.module');
  }
  if($product.length > 0){
    if ($product.data('gfv3product') !== undefined) {
    	var selectedVariant = $product.data('gfv3product').getVariant();
    	customBadge(selectedVariant);
    }
  }
  
  function changeVariantFunction(variant){
  	customBadge(variant);
  }
  
  var currentWrapProductId = jQuery('[data-label="Product"]').attr('id');
  if (window.GEMSTORE) {
  	window.GEMSTORE.subscribe("product-"+currentWrapProductId+"-variant", changeVariantFunction);
  }
  
  function customBadge(variant){
  	var currentPrice = variant.price;
  	var comparePrice = variant.compare_at_price;
  	if(currentPrice !== null && comparePrice !== null){
  		if(currentPrice < comparePrice){
  			diff = comparePrice - currentPrice;
  		}else{
  			diff = currentPrice - comparePrice;
  		}
  		if(diff <= 0){
  			$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  		}else{
  			$product.find('.gf_product-badge-anchor').css({'display': 'block'});
  		}
  	}else{
  		$product.find('.gf_product-badge-anchor').css({'display': 'none'});
  	}
  }
  /* End custom code */

})(window.GemQuery || jQuery);
    
  
    (function(jQuery) {
    var $module = jQuery('#m-1669363568541-child18-2').children('.module');
    $module.gfV3ProductPrice({
        displayCurrency: true
    });
})(window.GemQuery || jQuery);
  
    
  
    
    
  
    
  
    
    
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
    
    
    
    
    
    
    
    
    
    
    
    
    
            
          
    
    
            
          
    (function( jQuery ){
  var $module = jQuery('#m-1769581754310').children('.module');
  if(jQuery().gfYoutube) {
    $module.gfYoutube();
  }
})( window.GemQuery || jQuery );
  
    (function( jQuery ){
  try {
    var $module = jQuery('#m-1769581754405').children('.module');   
    var navspeed = $module.data('navspeed'),
      autoplaytimeout = $module.data('autoplaytimeout'),
      autoplayhoverpause = $module.data('autoplayhoverpause'),
      navlg = $module.data('navlg'),
      navmd = $module.data('navmd'),
      navsm = $module.data('navsm'),
      navxs = $module.data('navxs'),
      collg = $module.data('collg'),
      colmd = $module.data('colmd'),
      colsm = $module.data('colsm'),
      colxs = $module.data('colxs'),
      dotslg = $module.data('dotslg'),
      dotsmd = $module.data('dotsmd'),
      dotssm = $module.data('dotssm'),
      dotsxs = $module.data('dotsxs'),
      marginlg = parseInt($module.data('marginlg')),
      marginmd = parseInt($module.data('marginmd')),
      marginsm = parseInt($module.data('marginsm')),
      marginxs = parseInt($module.data('marginxs'));

    var mode = jQuery('.gryffeditor').hasClass('editing') ? 'dev' : 'production';
    if(mode == 'production') {
    var autoplay = $module.data('autoplay'), 
        autoRefresh = true, 
        loop = $module.data('loop');
    } else {
    var autoplay = 0, 
        autoRefresh = false, 
        loop = 0;
    }

    var initCarousel = function() {
      $module.owlCarousel({
        mouseDrag: false,
        autoplayHoverPause: autoplayhoverpause,
        autoplay: autoplay,
        autoRefresh: autoRefresh,
        autoplaySpeed: navspeed,
        autoplayTimeout: autoplaytimeout,
        loop: loop,
        navSpeed: navspeed,
        autoWidth: !1,
        responsiveClass:true,
        responsive:{
          0:{
            items:colxs,
            nav: navxs,
            dots:dotsxs,
            margin: marginxs
          },
          768:{
            items:colsm,
            nav: navsm,
            dots:dotssm,
            margin: marginsm
          },
          992:{
            items:colmd,
            nav: navmd,
            dots:dotsmd,
            margin: marginmd
          },
          1200:{
            items:collg,
            nav: navlg,
            dots:dotslg,
            margin: marginlg
          }
        },
        onInitialized: function () {
          $module.closest('.module-wrap[data-label="Carousel"]').addClass('gf-carousel-loaded');
          jQuery(window).trigger("resize");
        }
      });
    }
    
    // Fix nested carousel bug	
    if ($module.parent().parent().closest('.module-wrap[data-label="Carousel"]').length > 0) {	
      setTimeout(function() {	
        initCarousel();	
      }, 300)	
    } else {	
      initCarousel();	
    }
  } catch(err) {}
})( window.GemQuery || jQuery );
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    (function( jQuery ){
  try {
    var $module = jQuery('#m-1769581754396').children('.module');   
    var navspeed = $module.data('navspeed'),
      autoplaytimeout = $module.data('autoplaytimeout'),
      autoplayhoverpause = $module.data('autoplayhoverpause'),
      navlg = $module.data('navlg'),
      navmd = $module.data('navmd'),
      navsm = $module.data('navsm'),
      navxs = $module.data('navxs'),
      collg = $module.data('collg'),
      colmd = $module.data('colmd'),
      colsm = $module.data('colsm'),
      colxs = $module.data('colxs'),
      dotslg = $module.data('dotslg'),
      dotsmd = $module.data('dotsmd'),
      dotssm = $module.data('dotssm'),
      dotsxs = $module.data('dotsxs'),
      marginlg = parseInt($module.data('marginlg')),
      marginmd = parseInt($module.data('marginmd')),
      marginsm = parseInt($module.data('marginsm')),
      marginxs = parseInt($module.data('marginxs'));

    var mode = jQuery('.gryffeditor').hasClass('editing') ? 'dev' : 'production';
    if(mode == 'production') {
    var autoplay = $module.data('autoplay'), 
        autoRefresh = true, 
        loop = $module.data('loop');
    } else {
    var autoplay = 0, 
        autoRefresh = false, 
        loop = 0;
    }

    var initCarousel = function() {
      $module.owlCarousel({
        mouseDrag: false,
        autoplayHoverPause: autoplayhoverpause,
        autoplay: autoplay,
        autoRefresh: autoRefresh,
        autoplaySpeed: navspeed,
        autoplayTimeout: autoplaytimeout,
        loop: loop,
        navSpeed: navspeed,
        autoWidth: !1,
        responsiveClass:true,
        responsive:{
          0:{
            items:colxs,
            nav: navxs,
            dots:dotsxs,
            margin: marginxs
          },
          768:{
            items:colsm,
            nav: navsm,
            dots:dotssm,
            margin: marginsm
          },
          992:{
            items:colmd,
            nav: navmd,
            dots:dotsmd,
            margin: marginmd
          },
          1200:{
            items:collg,
            nav: navlg,
            dots:dotslg,
            margin: marginlg
          }
        },
        onInitialized: function () {
          $module.closest('.module-wrap[data-label="Carousel"]').addClass('gf-carousel-loaded');
          jQuery(window).trigger("resize");
        }
      });
    }
    
    // Fix nested carousel bug	
    if ($module.parent().parent().closest('.module-wrap[data-label="Carousel"]').length > 0) {	
      setTimeout(function() {	
        initCarousel();	
      }, 300)	
    } else {	
      initCarousel();	
    }
  } catch(err) {}
})( window.GemQuery || jQuery );
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    (function( jQuery ){
  try {
    var $module = jQuery('#m-1769581754393').children('.module');   
    var navspeed = $module.data('navspeed'),
      autoplaytimeout = $module.data('autoplaytimeout'),
      autoplayhoverpause = $module.data('autoplayhoverpause'),
      navlg = $module.data('navlg'),
      navmd = $module.data('navmd'),
      navsm = $module.data('navsm'),
      navxs = $module.data('navxs'),
      collg = $module.data('collg'),
      colmd = $module.data('colmd'),
      colsm = $module.data('colsm'),
      colxs = $module.data('colxs'),
      dotslg = $module.data('dotslg'),
      dotsmd = $module.data('dotsmd'),
      dotssm = $module.data('dotssm'),
      dotsxs = $module.data('dotsxs'),
      marginlg = parseInt($module.data('marginlg')),
      marginmd = parseInt($module.data('marginmd')),
      marginsm = parseInt($module.data('marginsm')),
      marginxs = parseInt($module.data('marginxs'));

    var mode = jQuery('.gryffeditor').hasClass('editing') ? 'dev' : 'production';
    if(mode == 'production') {
    var autoplay = $module.data('autoplay'), 
        autoRefresh = true, 
        loop = $module.data('loop');
    } else {
    var autoplay = 0, 
        autoRefresh = false, 
        loop = 0;
    }

    var initCarousel = function() {
      $module.owlCarousel({
        mouseDrag: false,
        autoplayHoverPause: autoplayhoverpause,
        autoplay: autoplay,
        autoRefresh: autoRefresh,
        autoplaySpeed: navspeed,
        autoplayTimeout: autoplaytimeout,
        loop: loop,
        navSpeed: navspeed,
        autoWidth: !1,
        responsiveClass:true,
        responsive:{
          0:{
            items:colxs,
            nav: navxs,
            dots:dotsxs,
            margin: marginxs
          },
          768:{
            items:colsm,
            nav: navsm,
            dots:dotssm,
            margin: marginsm
          },
          992:{
            items:colmd,
            nav: navmd,
            dots:dotsmd,
            margin: marginmd
          },
          1200:{
            items:collg,
            nav: navlg,
            dots:dotslg,
            margin: marginlg
          }
        },
        onInitialized: function () {
          $module.closest('.module-wrap[data-label="Carousel"]').addClass('gf-carousel-loaded');
          jQuery(window).trigger("resize");
        }
      });
    }
    
    // Fix nested carousel bug	
    if ($module.parent().parent().closest('.module-wrap[data-label="Carousel"]').length > 0) {	
      setTimeout(function() {	
        initCarousel();	
      }, 300)	
    } else {	
      initCarousel();	
    }
  } catch(err) {}
})( window.GemQuery || jQuery );
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    (function( jQuery ){
  // var $module = jQuery('#m-1769582084820').children('.module');
  // You can add custom Javascript code right here.
})( window.GemQuery || jQuery );
  
    
  
    
    
    
            
          
    
    
    
    
    
    
    
    
    
    
    
    
    
            
          
    
    
    
  