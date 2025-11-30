using CadabraTest.API.Models;

namespace CadabraTest.API.Services;
public class AIAnalysisService : IAIAnalysisService
{
    private readonly ILogger<AIAnalysisService> _logger;
    private readonly IConfiguration _configuration;
    private readonly HttpClient? _httpClient;

    public AIAnalysisService(ILogger<AIAnalysisService> logger, IConfiguration configuration, HttpClient? httpClient = null)
    {
        _logger = logger;
        _configuration = configuration;
        _httpClient = httpClient;
    }

    public async Task<AIAnalysis> GenerateAnalysisAsync(PartMetadata partMetadata)
    {
            var analysis = new AIAnalysis();

            if (partMetadata.Dimensions != null)
            {
                if (partMetadata.Dimensions.Length > 100 || partMetadata.Dimensions.Width > 100)
                    analysis.Insights.Add("This part is relatively large. Consider material strength.");
                else
                    analysis.Insights.Add("Part dimensions are moderate.");
            }

            if (!string.IsNullOrEmpty(partMetadata.Material))
            {
                if (partMetadata.Material.Contains("Aluminum"))
                    analysis.Recommendations.Add("Aluminum is lightweight; check for load requirements.");
                else
                    analysis.Recommendations.Add("Review material for strength and cost.");
            }

            if (partMetadata.Mass.HasValue && partMetadata.Mass > 5.0)
                analysis.Insights.Add("Part is heavy; consider weight optimization.");
            else
                analysis.Insights.Add("Mass is within normal range.");

            analysis.Summary = "Basic rule-based analysis completed.";

            return analysis;
    }

    public async Task<AIAnalysis> GenerateAdvanceAnalysisAsync(PartMetadata partMetadata)
    {
        var analysis = new AIAnalysis
        {
            Insights = new List<string>(),
            Recommendations = new List<string>()
        };

        var scores = new AnalysisScores();

        AnalyzeDimensions(partMetadata, analysis, scores);

        AnalyzeMaterial(partMetadata, analysis, scores);

        AnalyzeMassAndDensity(partMetadata, analysis, scores);

        AnalyzeVolumeEfficiency(partMetadata, analysis, scores);

        AnalyzeCostAndManufacturing(partMetadata, analysis, scores);

        AnalyzeSurfaceAreaRatio(partMetadata, analysis, scores);

        AnalyzeStructuralIntegrity(partMetadata, analysis, scores);

        analysis.Summary = GenerateAdvancedSummary(partMetadata, scores);

        return analysis;
    }

    private class AnalysisScores
    {
        public int DesignComplexity { get; set; } = 0;
        public int ManufacturabilityScore { get; set; } = 100;
        public int CostEfficiencyScore { get; set; } = 100;
        public int StructuralScore { get; set; } = 100;
        public int OptimizationPotential { get; set; } = 0;
    }

    private void AnalyzeDimensions(PartMetadata part, AIAnalysis analysis, AnalysisScores scores)
    {
        if (part.Dimensions == null) return;

        var length = part.Dimensions.Length;
        var width = part.Dimensions.Width;
        var height = part.Dimensions.Height;
        var maxDim = Math.Max(length, Math.Max(width, height));
        var minDim = Math.Min(length, Math.Min(width, height));
        var aspectRatio = maxDim / (minDim > 0 ? minDim : 1);

        if (maxDim > 500)
        {
            analysis.Insights.Add($"Large-scale component ({maxDim:F1} {part.Dimensions.Units}). Requires specialized manufacturing equipment and handling procedures.");
            analysis.Recommendations.Add("Consider modular design approach for easier manufacturing and assembly. Evaluate transportation constraints.");
            scores.ManufacturabilityScore -= 20;
            scores.CostEfficiencyScore -= 15;
        }
        else if (maxDim > 200)
        {
            analysis.Insights.Add($"Medium-sized component with standard manufacturing requirements. Dimension: {length:F1}×{width:F1}×{height:F1} {part.Dimensions.Units}");
            scores.ManufacturabilityScore += 10;
        }
        else if (maxDim < 10)
        {
            analysis.Insights.Add($"Micro-precision part detected ({maxDim:F1} {part.Dimensions.Units}). Requires high-precision CNC machining or micro-manufacturing techniques.");
            analysis.Recommendations.Add("Consider EDM (Electrical Discharge Machining) or wire EDM for complex geometries. Implement strict tolerance controls (±0.001mm).");
            scores.DesignComplexity += 30;
            scores.ManufacturabilityScore -= 15;
        }

        if (aspectRatio > 10)
        {
            analysis.Insights.Add($"High aspect ratio detected ({aspectRatio:F1}:1). Part is elongated which may cause deflection under load and machining challenges.");
            analysis.Recommendations.Add("Add support ribs or gussets to prevent bending. Consider multi-axis CNC programming to minimize tool deflection during machining.");
            scores.StructuralScore -= 20;
            scores.OptimizationPotential += 15;
        }
        else if (aspectRatio > 5)
        {
            analysis.Insights.Add($"Moderate aspect ratio ({aspectRatio:F1}:1). Monitor for potential deflection in long, thin sections.");
            analysis.Recommendations.Add("Verify FEA analysis for stress concentrations in narrow sections.");
            scores.OptimizationPotential += 10;
        }

        var isSymmetric = Math.Abs(length - width) < 0.01;
        if (isSymmetric)
        {
            analysis.Insights.Add("Symmetric design detected. Simplifies fixturing and reduces manufacturing setup time.");
            scores.ManufacturabilityScore += 10;
        }
    }

    private void AnalyzeMaterial(PartMetadata part, AIAnalysis analysis, AnalysisScores scores)
    {
        if (string.IsNullOrEmpty(part.Material)) return;

        var material = part.Material.ToLower();

        if (material.Contains("aluminum") || material.Contains("aluminium"))
        {
            if (material.Contains("6061"))
            {
                analysis.Insights.Add("6061-T6 Aluminum: Excellent machinability, good corrosion resistance (UTS: 310 MPa, Yield: 276 MPa). Widely used for structural applications.");
                analysis.Recommendations.Add("Consider T6 heat treatment for maximum strength. Anodize for enhanced corrosion protection and surface hardness.");
            }
            else if (material.Contains("7075"))
            {
                analysis.Insights.Add("7075 Aluminum: High-strength aerospace grade (UTS: 572 MPa). Superior strength-to-weight ratio but lower corrosion resistance.");
                analysis.Recommendations.Add("Apply protective coating (anodizing/Alodine) to prevent corrosion. Not recommended for welded assemblies due to heat-affected zone weakening.");
            }
            else
            {
                analysis.Insights.Add("Aluminum alloy provides density of ~2.7 g/cm³, excellent thermal conductivity (167 W/m·K), and 33% the weight of steel.");
                analysis.Recommendations.Add("Specify exact alloy grade (2xxx, 6xxx, or 7xxx series) for optimized mechanical properties. Consider T4 or T6 temper conditions.");
            }
            
            if (part.Mass > 3.0)
            {
                analysis.Recommendations.Add("Aluminum's lightweight properties are underutilized. Consider internal cavities, pocketing, or lattice structures to reduce mass by 20-40%.");
                scores.OptimizationPotential += 20;
            }
            scores.CostEfficiencyScore += 5;
        }
        else if (material.Contains("steel"))
        {
            if (material.Contains("stainless") || material.Contains("304") || material.Contains("316"))
            {
                analysis.Insights.Add("Stainless steel (density: 8.0 g/cm³): Excellent corrosion resistance, high strength, but 3× heavier than aluminum. Grade 316 offers superior corrosion resistance in marine/chemical environments.");
                analysis.Recommendations.Add("Consider 17-4 PH stainless for precipitation hardening to achieve 1100+ MPa tensile strength. Use carbide tooling for machining efficiency.");
                scores.CostEfficiencyScore -= 15;
            }
            else if (material.Contains("tool steel") || material.Contains("d2") || material.Contains("a2"))
            {
                analysis.Insights.Add("Tool steel provides exceptional hardness (58-62 HRC after heat treatment) and wear resistance. Ideal for dies, molds, and cutting tools.");
                analysis.Recommendations.Add("Implement proper heat treatment cycle: austenitizing at 1850°F, quenching, and triple tempering for dimensional stability.");
                scores.DesignComplexity += 20;
            }
            else
            {
                analysis.Insights.Add("Carbon steel (density: 7.85 g/cm³): Cost-effective with UTS ranging 400-700 MPa depending on carbon content. Requires surface treatment for corrosion protection.");
                analysis.Recommendations.Add("Apply zinc plating, powder coating, or black oxide finish for corrosion resistance. Consider case hardening for wear surfaces.");
                scores.CostEfficiencyScore += 10;
            }

            if (part.Mass > 10.0)
            {
                analysis.Recommendations.Add("Heavy steel component. Evaluate alternative materials: titanium (60% weight of steel), high-strength aluminum alloys, or composites for weight-critical applications.");
                scores.OptimizationPotential += 25;
            }
        }
        else if (material.Contains("titanium") || material.Contains("ti-6al-4v"))
        {
            analysis.Insights.Add("Titanium Grade 5 (Ti-6Al-4V): Exceptional strength-to-weight ratio (density: 4.43 g/cm³, UTS: 950 MPa). 40% lighter than steel with comparable strength. Biocompatible and corrosion-resistant.");
            analysis.Recommendations.Add("Use flood coolant and low cutting speeds (SFM: 50-80) due to poor thermal conductivity. Premium material cost justified for aerospace, medical, and performance applications.");
            scores.CostEfficiencyScore -= 40;
            scores.DesignComplexity += 25;
        }
        else if (material.Contains("plastic") || material.Contains("polymer") || material.Contains("abs") || material.Contains("nylon") || material.Contains("peek"))
        {
            if (material.Contains("peek"))
            {
                analysis.Insights.Add("PEEK (PolyEther Ether Ketone): High-performance thermoplastic with exceptional chemical resistance, operating temperature up to 260°C, and biocompatibility.");
                analysis.Recommendations.Add("Consider for medical implants, aerospace bushings, or chemical processing equipment. Can replace metal in many applications with 80% weight savings.");
                scores.CostEfficiencyScore -= 25;
            }
            else if (material.Contains("abs"))
            {
                analysis.Insights.Add("ABS plastic: Good impact resistance, easily machinable, suitable for injection molding. Operating temperature: -40°C to 80°C.");
                analysis.Recommendations.Add("Not suitable for structural loads >50 MPa. Consider fiber-reinforced variants for improved strength (glass or carbon fiber).");
                scores.StructuralScore -= 30;
            }
            else
            {
                analysis.Insights.Add("Polymer material: Low density (~1.1-1.4 g/cm³), excellent for corrosion resistance and electrical insulation. Limited by temperature and mechanical strength.");
                analysis.Recommendations.Add("Validate operating temperature range and chemical exposure. Consider glass-filled nylon (PA6 GF30) for 3× strength improvement over unfilled polymer.");
            }
            scores.CostEfficiencyScore += 15;
        }
        else if (material.Contains("carbon fiber") || material.Contains("composite"))
        {
            analysis.Insights.Add("Carbon fiber composite: Ultra-high strength-to-weight ratio (specific strength 5× steel). Anisotropic properties require careful fiber orientation design.");
            analysis.Recommendations.Add("Optimize ply layup schedule for primary load paths. Consider autoclave curing for aerospace applications or RTM (Resin Transfer Molding) for cost-sensitive parts.");
            scores.CostEfficiencyScore -= 35;
            scores.DesignComplexity += 30;
        }
    }

    private void AnalyzeMassAndDensity(PartMetadata part, AIAnalysis analysis, AnalysisScores scores)
    {
        if (!part.Mass.HasValue || !part.Volume.HasValue) return;

        var density = part.Mass.Value / part.Volume.Value; 

        analysis.Insights.Add($"Calculated density: {density:F0} kg/m³. Mass: {part.Mass:F3} kg, Volume: {part.Volume * 1e6:F2} cm³");

        if (density > 7500 && density < 8100)
        {
            analysis.Insights.Add("Density consistent with steel/iron alloys (7850 kg/m³). Confirms material specification accuracy.");
        }
        else if (density > 2500 && density < 2900)
        {
            analysis.Insights.Add("Density consistent with aluminum alloys (2700 kg/m³). Material specification verified.");
        }
        else if (density > 4300 && density < 4700)
        {
            analysis.Insights.Add("Density matches titanium alloys (4430 kg/m³). Premium material confirmed.");
        }
        else if (density < 2000)
        {
            analysis.Insights.Add("Low density indicates polymer/composite material or hollow internal structure.");
        }

        if (part.Mass > 2.0 && density > 2500)
        {
            var potentialSavings = part.Mass.Value * 0.3; 
            analysis.Recommendations.Add($"Weight optimization opportunity: Implement generative design or topology optimization to potentially reduce mass by {potentialSavings:F2} kg (30%) while maintaining structural performance.");
            scores.OptimizationPotential += 30;
        }

        var strengthToWeight = CalculateStrengthToWeightScore(part.Material, density);
        if (strengthToWeight < 50)
        {
            analysis.Recommendations.Add("Suboptimal strength-to-weight ratio. Consider alternative materials: titanium alloys, high-strength aluminum (7075), or carbon fiber composites for performance-critical applications.");
            scores.OptimizationPotential += 15;
        }
    }

    private void AnalyzeVolumeEfficiency(PartMetadata part, AIAnalysis analysis, AnalysisScores scores)
    {
        if (!part.Volume.HasValue || part.Dimensions == null) return;

        var boundingVolume = part.Dimensions.Length * part.Dimensions.Width * part.Dimensions.Height / 1e9; // Convert to m³
        var volumeUtilization = part.Volume.Value / boundingVolume * 100;

        if (volumeUtilization < 40)
        {
            analysis.Insights.Add($"Low volume utilization ({volumeUtilization:F1}% of bounding box). Complex geometry or significant internal voids detected.");
            analysis.Recommendations.Add("Optimize bounding box efficiency. Consider nesting multiple parts or consolidating assembly into single component using additive manufacturing.");
            scores.DesignComplexity += 20;
            scores.OptimizationPotential += 10;
        }
        else if (volumeUtilization > 85)
        {
            analysis.Insights.Add($"High volume utilization ({volumeUtilization:F1}%). Near-solid geometry may be over-designed.");
            analysis.Recommendations.Add("Investigate lightweighting opportunities: internal ribbing, honeycomb structures, or lattice infill patterns to reduce material usage without compromising strength.");
            scores.OptimizationPotential += 20;
        }
    }

    private void AnalyzeCostAndManufacturing(PartMetadata part, AIAnalysis analysis, AnalysisScores scores)
    {
        if (part.CustomProperties == null) return;

        if (part.CustomProperties.TryGetValue("CostEstimate", out var costStr) && double.TryParse(costStr, out var cost))
        {
            var costPerKg = part.Mass.HasValue ? cost / part.Mass.Value : 0;
            
            if (costPerKg > 50)
            {
                analysis.Insights.Add($"High cost per kg (${costPerKg:F2}/kg). Indicates complex machining, premium material, or low-volume production.");
                analysis.Recommendations.Add("Evaluate DFM (Design for Manufacturing): reduce tight tolerances from ±0.01mm to ±0.05mm where possible, minimize tool changes, eliminate undercuts requiring specialized tooling.");
                scores.OptimizationPotential += 25;
            }

            if (cost > 100)
            {
                analysis.Recommendations.Add("High-value component. Implement in-process inspection and SPC (Statistical Process Control) to prevent costly scrap. Consider first article inspection protocol.");
            }
        }

        if (part.CustomProperties.TryGetValue("LeadTime", out var leadTime))
        {
            if (leadTime.Contains("week") && int.TryParse(new string(leadTime.Where(char.IsDigit).ToArray()), out var weeks) && weeks > 4)
            {
                analysis.Insights.Add($"Extended lead time ({leadTime}). Suggests complex manufacturing process or material procurement challenges.");
                analysis.Recommendations.Add("Investigate supplier alternatives, consider Just-In-Time manufacturing, or maintain strategic inventory buffer for critical components.");
                scores.ManufacturabilityScore -= 15;
            }
        }

        if (part.Dimensions != null)
        {
            var maxDim = Math.Max(part.Dimensions.Length, Math.Max(part.Dimensions.Width, part.Dimensions.Height));
            
            if (maxDim < 50 && part.Volume < 0.0001)
            {
                analysis.Recommendations.Add("Candidate for Swiss-type turning or micro-milling. Consider MIM (Metal Injection Molding) for high-volume production (>10,000 units/year).");
            }
            else if (maxDim > 300)
            {
                analysis.Recommendations.Add("Large format machining required. Evaluate portal milling or multi-axis horizontal machining centers. Consider weldment assembly for cost reduction.");
            }
        }
    }

    private void AnalyzeSurfaceAreaRatio(PartMetadata part, AIAnalysis analysis, AnalysisScores scores)
    {
        if (!part.Volume.HasValue || part.Dimensions == null) return;

        var l = part.Dimensions.Length / 1000;
        var w = part.Dimensions.Width / 1000;
        var h = part.Dimensions.Height / 1000;
        var approxSurfaceArea = 2 * (l * w + w * h + h * l);
        var surfaceToVolumeRatio = approxSurfaceArea / part.Volume.Value;

        if (surfaceToVolumeRatio > 10000)
        {
            analysis.Insights.Add($"High surface area to volume ratio ({surfaceToVolumeRatio:F0} m⁻¹). Thin-walled or intricate geometry with significant surface exposure.");
            analysis.Recommendations.Add("Consider coating requirements for corrosion protection. Surface finish critical for performance - specify Ra value (Ra ≤ 1.6 μm for precision applications). Evaluate investment casting or AM for complex geometries.");
            scores.DesignComplexity += 15;
        }
    }

    private void AnalyzeStructuralIntegrity(PartMetadata part, AIAnalysis analysis, AnalysisScores scores)
    {
        var concerns = new List<string>();

        if (part.Mass.HasValue && part.Volume.HasValue)
        {
            var density = part.Mass.Value / part.Volume.Value;
            if (density < 1000 && !part.Material?.ToLower().Contains("foam") == true)
            {
                concerns.Add("Potential thin-wall structure detected");
                analysis.Recommendations.Add("Verify minimum wall thickness meets structural requirements (typical minimum: 2mm for plastics, 1mm for metals). Perform FEA to validate against buckling under compressive loads.");
            }
        }

        if (part.Dimensions != null)
        {
            var aspectRatio = Math.Max(part.Dimensions.Length, Math.Max(part.Dimensions.Width, part.Dimensions.Height)) /
                            Math.Min(part.Dimensions.Length, Math.Min(part.Dimensions.Width, part.Dimensions.Height));
            
            if (aspectRatio > 8)
            {
                concerns.Add("High aspect ratio may create stress concentrations");
                analysis.Recommendations.Add("Add generous fillet radii (R ≥ 3mm) at internal corners to reduce stress concentration factors by 50-70%. Avoid sharp edges which act as crack initiation sites.");
            }
        }

        if (concerns.Any())
        {
            analysis.Insights.Add($"Structural concerns identified: {string.Join(", ", concerns)}. Recommend finite element analysis (FEA) for validation.");
            scores.StructuralScore -= 20;
        }
    }

    private int CalculateStrengthToWeightScore(string material, double density)
    {
        if (string.IsNullOrEmpty(material)) return 50;

        var mat = material.ToLower();
        if (mat.Contains("titanium")) return 95;
        if (mat.Contains("carbon fiber")) return 100;
        if (mat.Contains("7075")) return 85;
        if (mat.Contains("aluminum")) return 75;
        if (mat.Contains("steel")) return 50;
        if (mat.Contains("plastic")) return 30;
        
        return 50;
    }

    private string GenerateAdvancedSummary(PartMetadata part, AnalysisScores scores)
    {
        var overallScore = (scores.ManufacturabilityScore + scores.CostEfficiencyScore + scores.StructuralScore) / 3;
        
        var rating = overallScore switch
        {
            >= 90 => "Excellent design",
            >= 75 => "Good design with minor optimization opportunities",
            >= 60 => "Acceptable design with moderate optimization potential",
            >= 40 => "Needs improvement in multiple areas",
            _ => "Significant redesign recommended"
        };

        return $"Advanced analysis of '{part.PartName}': {rating}. " +
            $"Manufacturability: {scores.ManufacturabilityScore}/100, " +
            $"Cost Efficiency: {scores.CostEfficiencyScore}/100, " +
            $"Structural Integrity: {scores.StructuralScore}/100. " +
            $"Optimization potential: {scores.OptimizationPotential}%. " +
            $"Design complexity index: {scores.DesignComplexity}.";
    }
}

