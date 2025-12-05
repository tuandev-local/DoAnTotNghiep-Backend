
import { where } from 'sequelize';
import { Op } from 'sequelize';
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
                let document = await db.Document.create({
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
                if (data.listTag && Array.isArray(data.listTag)) {
                    for (let tagName of data.listTag) {
                        let [tag] = await db.Tag.findOrCreate({
                            where: { name: tagName }
                        });
                        await db.DocumentTag.findOrCreate({
                            where: { documentId: document.id, tagId: tag.id },
                            default: { documentId: document.id, tagId: tag.id }
                        });
                    }
                }

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
                        { model: db.Tag, through: { attributes: [] }, attributes: ['name'] }
                    ],
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
            let isExist = await db.Favour.findOne({
                where: {
                    userId: data.userId,
                    documentId: data.documentId
                }
            });
            if (isExist) {
                resolve({
                    errCode: 1,
                    errMessage: 'This document already in your Favourites Document!'
                })
            }
            else {
                await db.Favour.create({
                    userId: data.userId,
                    documentId: data.documentId
                });
                resolve({
                    errCode: 0,
                    errMessage: 'Add Favourites Document Successful!'
                });
            }

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

let getManageDocumentList = (statusInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!statusInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing status!....'
                })
            }
            else {
                let document = await db.Document.findAll({
                    where: { status: statusInput },
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
            }

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

let getDocumentByKeyword = (keywordInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!keywordInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Plz input content yout want to find!'
                })
            }
            else {
                let document = await db.Document.findAll({
                    where: {
                        [Op.or]: [
                            {
                                title: {
                                    [Op.like]: `${keywordInput}%`
                                },
                            },
                            {
                                description: {
                                    [Op.like]: `%${keywordInput}%`
                                }
                            }
                        ]
                    }
                });
                resolve({
                    errCode: 0,
                    document: document
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let suggestDocument = (documentId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!documentId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Document not found!'
                })
            }
            else {
                //get tag of the document input
                const documentTags = await db.DocumentTag.findAll({
                    where: { documentId: documentId },
                    attributes: ['tagId']
                });
                const listTagId = documentTags.map(item => item.tagId);
                //get document same tag except the view
                const related = await db.DocumentTag.findAll({
                    attributes: [
                        'documentId',
                        [db.sequelize.fn('COUNT', db.sequelize.col('tagId')), 'score']
                    ],
                    where: {
                        tagId: listTagId,
                        documentId: { [Op.ne]: documentId }
                    },
                    include: [
                        { model: db.Document, attributes: ['id', 'title'] }
                    ],
                    group: ['documentId', 'Document.id'],
                    limit: 5,
                    order: [[db.sequelize.literal('score'), 'DESC']]
                });

                resolve({
                    errCode: 0,
                    results: related
                })
            }
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
    getManageDocumentList,
    getDocumentByFaculty,
    getDocumentByMajor,
    getDocumentByKeyword,
    suggestDocument
}