// The root URL for the RESTful services
var rootURL = "api/wines";

var currentWine;

// Retrieve wine list when application starts 
findAll();

//findAllfunny();

//findRandom();

// Nothing to delete in initial application state
$('#btnDelete').hide();

// Register listeners
$('#searchButton').click(function() {
	search($('#searchText').val());
	$('#searchText').val('');
	return false;
});

// Trigger search when pressing 'Return' on search key input field
$('#searchText').keypress(function(e){
	if(e.which == 13) {
		search($('#searchKey').val());
		e.preventDefault();
		return false;
    }
});

$('#btnAdd').click(function() {
	newWine();
	return false;
});

$('#btnSave').click(function() {
	
		addWine();
		findRandom();
		findAll();
	return false;
});


$('#btnUpdate').click(function() {
	
	var timpal = $('#timpalText').val();
	var uid = $('#timpalUID').val();
	
	if (uid==""){
		Login();
	}else{
		if (timpal.length <= 10) {
			alert("Yakin cuma gitu, Fren?");
		}else{
			updateWine();
		}
	}
	
	
	return false;
});

$('#btnDelete').click(function() {
	deleteWine();
	return false;
});

// Replace broken images with generic wine bottle
$("img").error(function(){
  $(this).attr("src", "/assets/img/semmur2.png");

});

function search(searchKey) {
	if (searchKey == '') 
		findAll();
	else
		findByName(searchKey);
}

function newWine() {
	$('#btnDelete').hide();
	currentWine = {};
	renderDetails(currentWine); // Display empty form
}

function findAll() {
	console.log('findAll');
	$.ajax({
		type: 'GET',
		url: rootURL,
		dataType: "json", // data type of response
		success: renderList
	});
}

function findAllfunny() {
	console.log('findAll FunnyPerson');
	$.ajax({
		type: 'GET',
		url: "api/fun",
		dataType: "json", // data type of response
		success: renderGuys
	});
}

function findRandom() {
	console.log('find Random product to post');
	$.ajax({
		type: 'GET',
		url: "api/random",
		dataType: "json", // data type of response
		success: randomWallpost
	});
}

function findRandom2() {
	console.log('find Random product to post');
	$.ajax({
		type: 'GET',
		url: "api/random",
		dataType: "json", // data type of response
		success: pageWallpost
	});
}

function findByName(searchKey) {
	console.log('findByName: ' + searchKey);
	$.ajax({
		type: 'GET',
		url: rootURL + '/search/' + searchKey,
		dataType: "json",
		success: renderList 
	});
}

function findById(id) {
	console.log('findById: ' + id);
	$.ajax({
		type: 'GET',
		url: rootURL + '/' + id,
		dataType: "json",
		success: function(data){

			console.log('findById success: ' + data.name);
			currentWine = data;
			renderDetails(currentWine);
		}
	});
}

function findByNama(id) {
	console.log('findByNama: ' + id);
	$.ajax({
		type: 'GET',
		url: rootURL + '/search2/' + id,
		dataType: "json",
		success: renderPenjual
	});
}


function addWine() {

	$.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: "api/wine",
		dataType: "json",
		data: formToJSON(),
		success: function(data, textStatus, jqXHR){
			//$('#wineId').val(data.id);
			$('#nama').val('');
			$('#deskripsi').val('');
			$('#web').val('http://');
			$('#harga').val('');
			$('#pict').val('semmur2.png');
			$('#myModal').modal('hide')
		},
		error: function(jqXHR, textStatus, errorThrown){
			//alert('addWine error: ' + textStatus);
		}
	});
}

function updateWine() {
	console.log('updateWine');
	$.ajax({
		type: 'PUT',
		contentType: 'application/json',
		url: rootURL + '/' + $('#wineId1').val(),
		dataType: "json",
		data: formToJSON2(),
		success: function(data, textStatus, jqXHR){
			//alert('Wine updated successfully');
			$('#timpalText').val('');
			$('#myModal').fadeOut();
		},
		error: function(jqXHR, textStatus, errorThrown){
			//alert('updateWine error: ' + textStatus);
		}
	});
}

function deleteWine() {
	console.log('deleteWine');
	$.ajax({
		type: 'DELETE',
		url: rootURL + '/' + $('#wineId').val(),
		success: function(data, textStatus, jqXHR){
			alert('Wine deleted successfully');
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert('deleteWine error');
		}
	});
}

function renderList(data) {
	// JAX-RS serializes an empty list as null, and a 'collection of one' as an object (not an 'array of one')
	
	var list = data == null ? [] : (data.wine instanceof Array ? data.wine : [data.wine]);

	$('#wineList').html('');
	$.each(list, function(index, wine) {
		
		if(wine.id == null){
			$('#wineList').append('<li>Produk Belum Terdaftar Disini. <a class="newProduk" href="#">Daftarkan?</a></li>');
		}else{
			$('#wineList').append('<li class="media">'
				    +'<a class="pull-left" href="#" >'
				      +'<img class="media-object" width=90px src="./uploads/'+wine.foto_brg+'" alt="Foto produk">'
				    +'</a>'
				   +' <div class="media-body text-info">'
				     +' <h4 class="media-heading text-success">'+wine.nama_brg+'</h4>'
				      +'&nbsp;&nbsp;'+wine.ket_brg
				      +'<br><span class="label label-success">'
				      +'<a href="" class="bukaPenjual" id="'+wine.nama_brg+'">'+wine.jml+' Penjual.</a>'
				      +'</span> '
				      +'<span class="label label-danger">'
				      +'<a href="" class="detilWine" id="'+wine.nama_brg+'">Jual Produk Ini?</a>'
				      +'</span>'
				      +'</div></li><hr>');
		}
		
		
	});
}

function renderPenjual(data) {
	// JAX-RS serializes an empty list as null, and a 'collection of one' as an object (not an 'array of one')
	
	var list = data == null ? [] : (data.wine instanceof Array ? data.wine : [data.wine]);

	$('#penjualList').html('');
	$.each(list, function(index, wine) {
		
			$('#penjualList').append('<li class="media">'
				    +'<a class="pull-left" href="https://www.facebook.com/'+wine.usr_brg+'" target="_blank">'
				      +'<img class="media-object img-rounded" src="https://graph.facebook.com/'+wine.usr_brg+'/picture?width=32&height=32" width="32" height="32"/>'
				    +'</a>'
				   +' <div class="media-body text-info">'
				     +' <h4 class="media-heading text-success">'+wine.nama_usr_brg+'</h4>'
				      +'<i class="fa fa-map-marker"></i>'+wine.alamat_brg
				      +'<br><i class="fa fa-money"></i> Rp. '+wine.hrg_brg
				      +'<br><i class="fa fa-globe"></i> <a href="'+wine.link_brg+'" target="_blank">'+wine.link_brg+'</a>'
				      +'</div></li>');
		
		
	});
}

function renderGuys(data) {
	// JAX-RS serializes an empty list as null, and a 'collection of one' as an object (not an 'array of one')
	var list = data == null ? [] : (data.wine instanceof Array ? data.wine : [data.wine]);

	$('#funList li').remove();
	$.each(list, function(index, wine) {
		$('#funList').append('<a target="_blank" href="https://www.facebook.com/'+wine.oauth_uid+'"><li class="list-group-item text-danger" style="font-family:Sniglet;"><img class="media_object img-circle" src="https://graph.facebook.com/'+wine.oauth_uid+'/picture?width=32&height=32" width="22" height="22"/> '+wine.name+' <span class="badge text-warning pull-right">'+wine.tawa+' <i class="fa fa-smile-o text-default"></i></span></li></a>');
		
	});
}

function randomWallpost(data) {
	// JAX-RS serializes an empty list as null, and a 'collection of one' as an object (not an 'array of one')
	var list = data == null ? [] : (data.wine instanceof Array ? data.wine : [data.wine]);

	$.each(list, function(index, wine) {
		
		var status = {
                name: "Ingin membeli " + wine.nama_brg + "? Hanya Rp. "+ wine.hrg_brg +" lho di "+wine.nama_usr_brg,
                link: "http://semmur.com",
                picture: "http://semmur.com/uploads/"+wine.foto_brg,
                caption: "http://semmur.com",
                description:'Temukan lebih banyak lagi harga termurah bagi produk-produk yang hendak Anda beli. Hanya di Semmur.com, direktori pembanding harga bagi grosir maupun dropshipper disekitar Anda.'
            };
        
        FB.api('/me/feed', 'post', status, function(response) {
            if (response && response.id) {
                //
            } else {
                //alert('Ada kesalahan saat posting ke Facebook.');
            }
        });
		
	});
}

function pageWallpost(data) {
	// JAX-RS serializes an empty list as null, and a 'collection of one' as an object (not an 'array of one')
	var list = data == null ? [] : (data.wine instanceof Array ? data.wine : [data.wine]);

	$.each(list, function(index, wine) {
		
		var status = {
                name: "Ingin membeli " + wine.nama_brg + "? Hanya Rp. "+ wine.hrg_brg +" lho di "+wine.nama_usr_brg,
                link: "http://semmur.com",
                picture: "http://semmur.com/uploads/"+wine.foto_brg,
                caption: "http://semmur.com",
                description:'Temukan lebih banyak lagi harga termurah bagi produk-produk yang hendak Anda beli. Hanya di Semmur.com, direktori pembanding harga bagi grosir maupun dropshipper disekitar Anda.'
            };
        
        FB.api('/semmurcom/feed', 'post', status, function(response) {
            if (response && response.id) {
                //
            } else {
                //alert('Ada kesalahan saat posting ke Facebook.');
            }
        });
		
	});
}

function renderDetails(wine) {
	$('#nama').val(wine.nama_brg);
	$('#deskripsi').val(wine.ket_brg);
	$('#output').html('<input type=hidden id=pict value="'+wine.foto_brg+'"><img src="./uploads/'+wine.foto_brg+'">');
}

// Helper function to serialize all the form fields into a JSON string
function formToJSON() {
	return JSON.stringify({
		"userid": $('#userid').val(), 
		"username": $('#username').val(), 
		"nama": $('#nama').val(),
		"deskripsi": $('#deskripsi').val(),
		"alamat": $('#address').val(),
		"email": $('#email').val(),
		"lat": $('#info1').val(),
		"lng": $('#info2').val(),
		"web": $('#web').val(),
		"harga": $('#harga').val(),
		"pict": $('#pict').val(),
		});
}
