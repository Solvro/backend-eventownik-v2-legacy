import { CamelCaseNamingStrategy } from "@adonisjs/lucid/orm";
import { LucidModel } from "@adonisjs/lucid/types/model";
import { ModelRelations } from "@adonisjs/lucid/types/relations";

export default class PrismaNamingStrategy implements CamelCaseNamingStrategy {
  tableName(model: LucidModel): string {
    return model.name;
  }

  columnName(_: LucidModel, attributeName: string): string {
    return attributeName;
  }

  serializedName(_: LucidModel, attributeName: string): string {
    return attributeName;
  }

  relationLocalKey(
    _: ModelRelations<LucidModel, LucidModel>["__opaque_type"],
    model: LucidModel,
    __: LucidModel,
  ): string {
    return `${model.name.charAt(0).toLocaleLowerCase() + model.name.slice(1)}${model.primaryKey.charAt(0).toUpperCase() + model.primaryKey.slice(1)}`;
  }

  relationForeignKey(
    _: ModelRelations<LucidModel, LucidModel>["__opaque_type"],
    __: LucidModel,
    relatedModel: LucidModel,
  ): string {
    return `${relatedModel.name.charAt(0).toLocaleLowerCase() + relatedModel.name.slice(1)}${relatedModel.primaryKey.charAt(0).toUpperCase() + relatedModel.primaryKey.slice(1)}`;
  }

  relationPivotTable(
    _: "manyToMany",
    model: LucidModel,
    relatedModel: LucidModel,
  ): string {
    return `${model.name}${relatedModel.name}`;
  }

  relationPivotForeignKey(_: "manyToMany", model: LucidModel): string {
    return `${model.name.charAt(0).toLocaleLowerCase() + model.name.slice(1)}${model.primaryKey.charAt(0).toUpperCase() + model.primaryKey.slice(1)}`;
  }

  paginationMetaKeys(): {
    total: string;
    perPage: string;
    currentPage: string;
    lastPage: string;
    firstPage: string;
    firstPageUrl: string;
    lastPageUrl: string;
    nextPageUrl: string;
    previousPageUrl: string;
  } {
    return {
      total: "total",
      perPage: "perPage",
      currentPage: "currentPage",
      lastPage: "lastPage",
      firstPage: "firstPage",
      firstPageUrl: "firstPageUrl",
      lastPageUrl: "lastPageUrl",
      nextPageUrl: "nextPageUrl",
      previousPageUrl: "previousPageUrl",
    };
  }
}
