const mgdb_username = 'eayeargan';
const mgdb_password = 'dtNUkbrKqEIW0eak';
const mgdb_cluster_name = `local_library`;
const mgdb_url = `mongodb+srv://${mgdb_username}:${mgdb_password}@cluster0.6svr6jn.mongodb.net/${mgdb_cluster_name}?retryWrites=true&w=majority&appName=Cluster0`;

module.exports = mgdb_url;
//console.log(mgdb_url);