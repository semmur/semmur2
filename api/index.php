<?php

require 'Slim/Slim.php';

$app = new Slim();

$app->get('/wines', 'getWines');
$app->get('/fun', 'getFuns');
$app->get('/random', 'getRand');
$app->get('/wines/:id',	'getWine');
$app->get('/wines/search/:query', 'findByName');
$app->get('/wines/search2/:query', 'findByNama');
$app->post('/wine', 'addWine');
$app->put('/wines/:id', 'updateWine');
$app->delete('/wines/:id',	'deleteWine');

$app->run();

function getWines() {
	$sql = "SELECT id, COUNT(id_brg) as jml, nama_brg, ket_brg, foto_brg FROM barang GROUP BY nama_brg ORDER BY jml DESC";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$wines = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo '{"wine": ' . json_encode($wines) . '}';
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getFuns() {
	$sql = "select oauth_uid, name, tawa FROM users WHERE tawa > 0 ORDER BY tawa DESC, name DESC LIMIT 5";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$wines = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo '{"wine": ' . json_encode($wines) . '}';
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getRand() {
	$sql = "SELECT * FROM barang ORDER BY RAND() LIMIT 1";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$wines = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo '{"wine": ' . json_encode($wines) . '}';
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addWine() {
	//error_log('addWine\n', 3, '/var/tmp/php.log');
	$request = Slim::getInstance()->request();
	$wine = json_decode($request->getBody());
	$sql = "INSERT INTO barang (tgl, nama_brg, ket_brg, foto_brg, usr_brg, nama_usr_brg, alamat_brg, email_brg, link_brg, hrg_brg, lat_brg, lng_brg) VALUES (now(), :nama, :deskripsi, :pict, :userid, :username, :alamat, :email, :web, :harga, :lat, :lng)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("userid", $wine->userid);
		$stmt->bindParam("username", $wine->username);
		$stmt->bindParam("nama", $wine->nama);
		$stmt->bindParam("deskripsi", $wine->deskripsi);
		$stmt->bindParam("alamat", $wine->alamat);
		$stmt->bindParam("email", $wine->email);
		$stmt->bindParam("lat", $wine->lat);
		$stmt->bindParam("lng", $wine->lng);
		$stmt->bindParam("web", $wine->web);
		$stmt->bindParam("harga", $wine->harga);
		$stmt->bindParam("pict", $wine->pict);
		$stmt->execute();
		$wine->id = $db->lastInsertId();
		$db = null;
		echo json_encode($wine); 
	} catch(PDOException $e) {
		
		error_log($e->getMessage(), 3, '/var/tmp/php.log');
		//echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		
	}
}

function getWine($id) {
	$sql = "SELECT * FROM barang WHERE nama_brg LIKE :id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$wine = $stmt->fetchObject();  
		$db = null;
		
		echo json_encode($wine); 
		
	} catch(PDOException $e) {
		
		echo json_encode($wine); 
		
	}
}

function updateWine($id) {
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$wine = json_decode($body);
	$sql = "UPDATE jokes SET uid_penyelesaian=:uid, penyelesaian=:timpal, akhir=now(), lama=:durasi WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("timpal", $wine->timpal);
		$stmt->bindParam("uid", $wine->uid);
		$stmt->bindParam("durasi", $wine->durasi);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
		echo json_encode($wine); 
	} catch(PDOException $e) {
		//echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function deleteWine($id) {
	$sql = "DELETE FROM wine WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function findByName($query) {
	$sql = "SELECT id, COUNT(id_brg) as jml, nama_brg, ket_brg, foto_brg FROM barang WHERE nama_brg LIKE :query OR ket_brg LIKE :query GROUP BY nama_brg ORDER BY jml DESC";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$query = "%".$query."%";  
		$stmt->bindParam("query", $query);
		$stmt->execute();
		$wines = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo '{"wine": ' . json_encode($wines) . '}';
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function findByNama($query) {
	$sql = "SELECT * FROM barang WHERE nama_brg LIKE :query ORDER BY hrg_brg, nama_usr_brg ASC";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$query = "%".$query."%";  
		$stmt->bindParam("query", $query);
		$stmt->execute();
		$wines = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo '{"wine": ' . json_encode($wines) . '}';
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getConnection() {
	$dbhost="localhost";
	$dbuser="semmurc1_usr";
	$dbpass="booHao4z";
	$dbname="semmurc1_smr";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

?>