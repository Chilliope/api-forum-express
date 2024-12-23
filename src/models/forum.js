const dbPool = require('../config/database')

const getTotalForumCount = () => {
    const SQLQuery = 'SELECT COUNT(*) AS total FROM forums';
    return dbPool.execute(SQLQuery);
}

const getAllForum = (offset, limit) => {
    const SQLQuery = `SELECT forums.id AS forum_id, forums.user_id, forums.title, forums.post, forums.created_at,
        users.fullname, users.username, users.password, users.image
        FROM forums
        JOIN users ON forums.user_id = users.id
        LIMIT ${limit} OFFSET ${offset}
    `

    return dbPool.execute(SQLQuery);
}

const createNewForum = (body) => {
    const SQLQuery = `INSERT INTO forums (user_id, title, post, created_at)
                      VALUES (
                      '${body.user_id}', 
                      '${body.title}', 
                      '${body.post}', 
                      '${body.created_at}')`

    return dbPool.execute(SQLQuery)
}

const updateForum = (body, id) => {
    const SQLQuery = `UPDATE forums 
                      SET 
                      title='${body.title}', 
                      post='${body.post}' 
                      WHERE id = ${id}`
    
    return dbPool.execute(SQLQuery)
}

const deleteForum = (id) => {
    const SQLQuery = `DELETE FROM forums WHERE id = ${id}`

    return dbPool.execute(SQLQuery)
}

module.exports = {
    getTotalForumCount,
    getAllForum,
    createNewForum,
    updateForum,
    deleteForum
}