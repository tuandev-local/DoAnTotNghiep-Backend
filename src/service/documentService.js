
import db from '../models/index';

require('dotenv').config({ path: './src/.env' });

let checkDocument = (documentFileName) => {
    return new Promise(async (resolve, reject) => {
        try {
            let document = await db.Document.findOne({
                where: { fileName: documentFileName },
            });
            if (document) {
                resolve(true)
            }
            else {
                resolve(false)
            }
        } catch (error) {
            reject(error)
        }
    })
}
let createDocument = (data) => {
    return new Promise(async (resolve, reject) => {

        try {
            let isExist = await checkDocument(data.fileName);
            if (isExist === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'this document already exist!'
                })
            }
            else {
                await db.Document.create({
                    title: data.title,
                    description: data.description,
                    facultyId: data.facultyId,
                    majorId: data.majorId,
                    userId: data.userId,
                    download: 0,
                    status: 'S1',
                    fileName: data.fileName,
                    filePath: data.filePath,
                    fileType: data.fileType,
                });
                resolve({
                    errCode: 0,
                    errMessage: 'Upload Document Successful!',

                })
            }
        } catch (error) {
            reject(error)
        }


    })
}

let getFaculty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let faculty = [];
            faculty = await db.Faculty.findAll();
            resolve(faculty)
        } catch (error) {
            reject(error)
        }
    })
}

let getMajor = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let major = [];
            major = await db.Major.findAll();
            resolve(major)
        } catch (error) {
            reject(error)
        }
    })
}

let getDocumentPaginationService = (pageInput, limitInput, offsetInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('page:', pageInput);
            console.log('limit: ', limitInput);
            console.log('offset: ', offsetInput);
            const { count, rows } = await db.Document.findAndCountAll({
                where: { status: 'S2' },
                limit: limitInput,
                offset: offsetInput,
                order: [['createdAt', 'DESC']],
            });
            resolve({
                errCode: 0,
                totalPage: Math.ceil(count / limitInput),
                currentPage: pageInput,
                totalItem: count,
                documents: rows,

            })
        } catch (error) {
            reject(error)
        }
    })
}

let getDetailDocumentService = (documentId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!documentId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing id!'
                })
            }
            else {
                let data = await db.Document.findOne({
                    where: {
                        id: documentId,
                    },
                    include: [
                        { model: db.User, attributes: ['firstName', 'lastName'] },

                    ],
                    raw: true,
                    nest: true
                });
                resolve({
                    errCode: 0,
                    data,
                    fileUrl: process.env.SERVER_URL + data.fileName

                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getDownloadDocument = (documentId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!documentId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing id!'
                })
            }
            else {
                let doc = await db.Document.findOne({
                    where: {
                        id: documentId,
                    },

                });
                doc.download += 1;
                await doc.save();
                const fileUrl = `${process.env.SERVER_URL}${doc.fileName}`
                resolve({
                    errCode: 0,
                    doc: doc.fileName,
                    fileUrl: fileUrl

                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let addFavourDocument = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Favour.create({
                userId: data.userId,
                documentId: data.documentId
            });
            resolve({
                errCode: 0,
                errMessage: 'Add Favourites Document Successful!'
            });
        } catch (error) {
            reject(error)
        }
    })
}

let getFavourDocument = (userIdInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userIdInput) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing id!"
                })
            }
            else {
                let doc = await db.Favour.findAll({
                    where: { userId: userIdInput },
                    include: [
                        { model: db.Document },

                    ],
                    raw: true,
                    nest: true
                });
                resolve({
                    errCode: 0,
                    doc
                })
            }

        } catch (error) {
            reject(error);
        }
    })
}

let putApproveDocument = (documentId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let document = await db.Document.findOne({
                where: { id: documentId }
            });
            if (!document) {
                resolve({
                    errCode: 1,
                    errMessage: 'Document is not found!'
                })
            }
            else {
                document.status = "S2";
                await document.save();
                resolve({
                    errCode: 0,
                    errMessage: "Approved document success!"
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}

let putRejectDocument = (documentId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let document = await db.Document.findOne({
                where: { id: documentId }
            });
            if (!document) {
                resolve({
                    errCode: 1,
                    errMessage: 'Document is not found!'
                })
            }
            else {
                document.status = "S3";
                await document.save();
                resolve({
                    errCode: 0,
                    errMessage: "Rejected document success!"
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}

let getPendingDocumentList = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let document = await db.Document.findAll({
                where: { status: 'S1' },
                include: [
                    { model: db.User, attributes: ['firstName', 'lastName'] },

                ],
                raw: true,
                nest: true
            });
            resolve({
                errCode: 0,
                data: document
            })
        } catch (error) {
            reject(error);
        }
    })
}

let getDocumentByFaculty = (facultyInput) => {
    return new Promise(async (resolve, reject) => {
        try {

            let doc = await db.Document.findAll({
                where: { facultyId: facultyInput }
            });
            resolve({
                doc
            })
        } catch (error) {
            reject(error)
        }
    })
}

let getDocumentByMajor = (majorInput) => {
    return new Promise(async (resolve, reject) => {
        try {

            let doc = await db.Document.findAll({
                where: { majorId: majorInput }
            });
            resolve({
                doc
            })
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    checkDocument,
    createDocument,
    getFaculty,
    getMajor,
    getDocumentPaginationService,
    getDetailDocumentService,
    getDownloadDocument,
    addFavourDocument,
    getFavourDocument,
    putApproveDocument,
    putRejectDocument,
    getPendingDocumentList,
    getDocumentByFaculty,
    getDocumentByMajor
}