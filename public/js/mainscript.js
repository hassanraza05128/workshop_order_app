var productID=null;
var formUrl='/admin/productreg';
var uploadUrl='/admin/contentreg';
// custom
$(function () {
    // Modal template
    var modalTemplate = '<div class="modal-dialog modal-lg" role="document">\n' +
        '  <div class="modal-content">\n' +
        '    <div class="modal-header">\n' +
        '      <div class="kv-zoom-actions btn-group">{toggleheader}{fullscreen}{borderless}{close}</div>\n' +
        '      <h6 class="modal-title">{heading} <small><span class="kv-zoom-title"></span></small></h6>\n' +
        '    </div>\n' +
        '    <div class="modal-body">\n' +
        '      <div class="floating-buttons btn-group"></div>\n' +
        '      <div class="kv-zoom-body file-zoom-content"></div>\n' + '{prev} {next}\n' +
        '    </div>\n' +
        '  </div>\n' +
        '</div>\n';

    // Buttons inside zoom modal
    var previewZoomButtonClasses = {
        toggleheader: 'btn btn-default btn-icon btn-xs btn-header-toggle',
        fullscreen: 'btn btn-default btn-icon btn-xs',
        borderless: 'btn btn-default btn-icon btn-xs',
        close: 'btn btn-default btn-icon btn-xs'
    };

    // Icons inside zoom modal classes
    var previewZoomButtonIcons = {
        prev: '<i class="icon-arrow-left32"></i>',
        next: '<i class="icon-arrow-right32"></i>',
        toggleheader: '<i class="icon-menu-open"></i>',
        fullscreen: '<i class="icon-screen-full"></i>',
        borderless: '<i class="icon-alignment-unalign"></i>',
        close: '<i class="icon-cross3"></i>'
    };

    // File actions
    var fileActionSettings = {
        showUpload: true,
        zoomClass: 'btn btn-link btn-xs btn-icon',
        zoomIcon: '<i class="icon-zoomin3"></i>',
        dragClass: 'btn btn-link btn-xs btn-icon',
        dragIcon: '<i class="icon-three-bars"></i>',
        removeClass: 'btn btn-link btn-icon btn-xs',
        removeIcon: '<i class="icon-trash"></i>',
        indicatorNew: '<i class="icon-file-plus text-slate"></i>',
        indicatorSuccess: '<i class="icon-checkmark3 file-icon-large text-success"></i>',
        indicatorError: '<i class="icon-cross2 text-danger"></i>',
        indicatorLoading: '<i class="icon-spinner2 spinner text-muted"></i>'
    };

    var fileuploader=$(".file-input-files");
    var pform=$('#form-product');
    var subButton=$('#submit-button-product');
    var resetButton=$('#reset-button-product');

    var addProductId=function (data) {
        productID=data.product._id;
        //console.log('product id stored in productID');
    };
    var formValid=function () {
        //console.log('form validity check');
        return pform[0].checkValidity();};
    var ajaxUnsucessCallback=function (jqXHR, textStatus, errorThrown) {
        var msg = 'An error has occurred' + ' : ' + jqXHR.responseJSON.msg;
        $('#msg').html("<div class='alert alert-danger alert-dismissable fade in'><strong>"+msg+"</strong></div>");
       // alert(msg);
       // console.log('form ajax error :'+textStatus+errorThrown,jqXHR.responseJSON.msg);
    };
    var ajaxSucessCallback=function (data, textStatus, jqXHR) {
        addProductId(data);
        var msg='<p>Success' + '</p';
        $('#msg').html("<div class='alert alert-success alert-dismissable fade in'><strong>"+data.msg+"</strong><br>"+(data.product)?data.product.name:''+"</div>");
        //console.log('form submit sucess with:',data);
    };
    var ajaxProductForm=function () {
        var formObj = {};
        var inputs=[];
        // check if already submited a product
        if(productID!==null){
            var msg='Already registered a product. Press Reset button to Add new Product';
            $('#msg').html("<div class='alert alert-warning alert-dismissable fade in'><strong>"+msg+"</strong></div>");
            //alert(msg);
           // console.log('form already there in variable')
            return true;}

        // check form validity
        if (formValid){
            inputs=pform.serializeArray();
            $.each(inputs, function (i, input) {
                formObj[input.name] = input.value;
            });
           // console.log('form is valid and about to submit');
            var res = $.ajax({
                url: formUrl,
                type: 'POST',
                async: false,
                data: formObj,
                error: ajaxUnsucessCallback,
                // dataType: 'jsonp',
                success: ajaxSucessCallback,
            });
           // console.log('File success form ajax ', productID);
            return true;
        }else{
            $('#msg').html("<div class='alert alert-danger alert-dismissable fade in'><strong>Form validity error has occurred</strong></div>");
            //console.log('form not valid');
            return false;}
    };
    var prodSubmit=function(){
        if(productID===null) {
            if (ajaxProductForm())
                fileuploader.fileinput('upload');
        }else{fileuploader.fileinput('upload');}
    };


    fileuploader.on('filepreajax',function (event, previewId, index) {
        if(productID===null) {
            prodSubmit();
            return {message: "Project not yet registered",data:{}};
        }
    });

    // submit the form with uploads start
    subButton.on('click', prodSubmit);
    //reset form to value null
    resetButton.on('click', function (e) {
        fileuploader.fileinput('clear').fileinput('reset');
        pform[0].reset();
        productID=null;
        $('#msg').html("<div class='alert alert-success alert-dismissable fade in'><strong>Product Register Panel has Reset For new Product to be  Entered</strong></div>");
    });

    fileuploader.fileinput({
        uploadUrl: uploadUrl, // server upload action
        uploadAsync: true,
        maxFileCount: 100,
        browseLabel: 'Browse',
        browseOnZoneClick:true,
        showBrowse:true,
        showUpload:true,
        showCancel:true,
        dropZoneEnabled:true,
        required:true,
        mergeAjaxCallbacks:false,
        //ajaxSettings:{},
        browseIcon: '<i class="icon-file-plus"></i>',
        uploadIcon: '<i class="icon-file-upload2"></i>',
        removeIcon: '<i class="icon-cross3"></i>',
        // layoutTemplates: {
        //     icon: '<i class="icon-file-check"></i>',
        //     modal: modalTemplate
        // },
        layoutTemplates: {
            icon: '<i class="icon-file-check"></i>',
            main1: "{preview}\n" +
            "<div class='input-group {class}'>\n" +
            "   <div class='input-group-btn'>\n" +
            "       {browse}\n" +
            "   </div>\n" +
            "   {caption}\n" +
            "   <div class='input-group-btn'>\n" +
            "       {upload}\n" +
            "       {remove}\n" +
            "   </div>\n" +
            "</div>",
            modal: modalTemplate
        },
        initialPreview: [],
        initialPreviewConfig: [],
        maxFilesNum: 10,
        maxFileSize:25*1024,//25Mb
        //minFileSize:0,
        //allowedPreviewTypes:['image'],
        allowedFileExtensions: ["jpg", "gif", "png"],
        initialPreviewAsData: true,
        overwriteInitial: true,
        initialCaption: "Add Images To This Product",
        previewZoomButtonClasses: previewZoomButtonClasses,
        previewZoomButtonIcons: previewZoomButtonIcons,
        fileActionSettings: fileActionSettings,
        uploadExtraData: function (previewId, index) {
            return (productID!==null)? {productID:productID}:{};
        },
    });

// .on('filepreupload',function (event, data, previewId, index) {
//     // if(!data.extra.productId) {
//     //     event.isDefaultPrevented();
//     // }
//     console.log('File pre upload triggered: ',data.extra.productID);
// });



});