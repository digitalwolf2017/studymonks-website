export interface MetaDataResponse {
    success: boolean;
    data: {
        id: number;
        title: string;
        slug: string;
        body: string;
        meta_keyword: string;
        meta_description: string;
        og_image: string;
        meta_tag: string;
    };
}
export interface MetaData {
    title: string;
    description: string;
    url: string;
    ogImage: string;
    keywords?: string;
}



