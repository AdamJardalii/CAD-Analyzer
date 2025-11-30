using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CadabraTest.API.Migrations
{
    /// <inheritdoc />
    public partial class AddAnalysisTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:PostgresExtension:hstore", ",,");

            migrationBuilder.CreateTable(
                name: "Analyses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AnalysisId = table.Column<Guid>(type: "uuid", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    PartMetadata_FileName = table.Column<string>(type: "text", nullable: true),
                    PartMetadata_PartName = table.Column<string>(type: "text", nullable: true),
                    PartMetadata_Dimensions_Length = table.Column<double>(type: "double precision", nullable: true),
                    PartMetadata_Dimensions_Width = table.Column<double>(type: "double precision", nullable: true),
                    PartMetadata_Dimensions_Height = table.Column<double>(type: "double precision", nullable: true),
                    PartMetadata_Dimensions_Units = table.Column<string>(type: "text", nullable: true),
                    PartMetadata_Material = table.Column<string>(type: "text", nullable: true),
                    PartMetadata_Mass = table.Column<double>(type: "double precision", nullable: true),
                    PartMetadata_Volume = table.Column<double>(type: "double precision", nullable: true),
                    PartMetadata_CustomProperties = table.Column<Dictionary<string, string>>(type: "hstore", nullable: true),
                    AIAnalysis_Id = table.Column<Guid>(type: "uuid", nullable: true),
                    AIAnalysis_Summary = table.Column<string>(type: "text", nullable: true),
                    AIAnalysis_Insights = table.Column<List<string>>(type: "text[]", nullable: true),
                    AIAnalysis_Recommendations = table.Column<List<string>>(type: "text[]", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Analyses", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Analyses");

            migrationBuilder.AlterDatabase()
                .OldAnnotation("Npgsql:PostgresExtension:hstore", ",,");
        }
    }
}
