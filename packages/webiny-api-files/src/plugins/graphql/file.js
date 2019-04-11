// @flow
import { resolveCreate, resolveDelete, resolveGet } from "webiny-api/graphql";

import listFiles from "./resolvers/listFiles";
import updateFileBySrc from "./resolvers/updateFileBySrc";

const fileFetcher = ctx => ctx.files.entities.File;
import {
    FileType,
    FileInputType,
    FileListResponseType,
    FileResponseType
} from "webiny-api-files/graphql";

export default {
    typeDefs: () => [FileType, FileInputType, FileListResponseType, FileResponseType],
    typeExtensions: `
        extend type FilesQuery {
            getFile(
                id: ID 
                where: JSON
                sort: String
            ): FileResponse
            
            listFiles(
                page: Int
                perPage: Int
                types: [String]
                sort: JSON
                search: String
            ): FileListResponse
        }
        
        extend type FilesMutation {
            createFile(
                data: FileInput!
            ): FileResponse
            
            updateFileBySrc(
                src: String!
                data: FileInput!
            ): FileResponse
        
            deleteFile(
                id: ID!
            ): DeleteResponse
        }
    `,
    resolvers: {
        FilesQuery: {
            getFile: resolveGet(fileFetcher),
            listFiles: listFiles(fileFetcher)
        },
        FilesMutation: {
            createFile: resolveCreate(fileFetcher),
            updateFileBySrc: updateFileBySrc(fileFetcher),
            deleteFile: resolveDelete(fileFetcher)
        }
    }
};
