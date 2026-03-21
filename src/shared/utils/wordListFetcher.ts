import { Word } from "@/shared/types"

export async function wordListFetcher(url:string) :Promise<Word[]>{
    const URL_PREFIX :string = ''

    const response = await fetch(URL_PREFIX+url)
    const words:Word[] = await response.json()

    return words
}