import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

@Pipe({ name: 'pagination', standalone: true })
export class PaginationPipe implements PipeTransform {
  transform(
    {
      currentPage,
      totalNumberOfPages,
    }: { currentPage: number; totalNumberOfPages: number },
    numberOfContiguousPagesToShow: number,
    extraInitFin: number
  ) {
    const paginationSet = Array.from(
      { length: numberOfContiguousPagesToShow },
      (_, i) =>
        i +
        ((currentPage ?? 0) - Math.ceil(numberOfContiguousPagesToShow / 2) + 1)
    );

    const paginationInit = Array.from(
      { length: extraInitFin },
      (_, i) => i + 1
    );
    const paginationFin = Array.from(
      { length: extraInitFin },
      (_, i) =>
        i - extraInitFin + (totalNumberOfPages ? totalNumberOfPages : 0) + 1
    );

    const pagesToShow = [
      ...new Set(
        [...paginationInit, ...paginationSet, ...paginationFin].sort(
          (a, b) => a - b
        )
      ),
    ].filter(
      (eachPageNumber) =>
        eachPageNumber > 0 && eachPageNumber <= (totalNumberOfPages ?? 1)
    );
    return pagesToShow;
  }
}
